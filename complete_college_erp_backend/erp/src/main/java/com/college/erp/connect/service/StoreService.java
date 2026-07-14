package com.college.erp.connect.service;

import com.college.erp.connect.dto.*;
import com.college.erp.connect.entity.*;
import com.college.erp.connect.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreService {

    private final StoreItemRepository itemRepository;
    private final PurchaseRepository purchaseRepository;
    private final ActivePowerUpRepository powerUpRepository;
    private final CoUserRepository coUserRepository;
    private final CoinService coinService;

    // ========== PUBLIC ENDPOINTS ==========

    public List<StoreItemResponse> getAllActiveItems() {
        return itemRepository.findByIsActiveTrueOrderByCategory()
                .stream()
                .map(this::mapToItemResponse)
                .collect(Collectors.toList());
    }

    public StoreItemResponse getItemById(Long id) {
        StoreItem item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        return mapToItemResponse(item);
    }

    public List<StoreItemResponse> getItemsByCategory(ItemCategory category) {
        return itemRepository.findByCategoryAndIsActiveTrue(category)
                .stream()
                .map(this::mapToItemResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PurchaseResponse purchaseItem(PurchaseRequest request, String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StoreItem item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Validations
        if (!item.getIsActive()) {
            throw new RuntimeException("Item is not available");
        }

        if (item.getStock() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        int totalPrice = item.getPrice() * request.getQuantity();

        // Check user balance
        CoinWallet wallet = coinService.getOrCreateWallet(user);
        if (wallet.getBalance() < totalPrice) {
            throw new RuntimeException("Insufficient coins");
        }

        // Deduct coins
        coinService.deductCoins(user, totalPrice, TransactionType.PURCHASE,
                String.format("Purchased %dx %s", request.getQuantity(), item.getName()));

        // Create purchase
        Purchase purchase = Purchase.builder()
                .user(user)
                .item(item)
                .quantity(request.getQuantity())
                .totalPrice(totalPrice)
                .status(item.getRequiresApproval() ? PurchaseStatus.PENDING : PurchaseStatus.APPROVED)
                .build();

        // Auto-approve and generate code if no approval needed
        if (!item.getRequiresApproval()) {
            purchase.setRedemptionCode(generateRedemptionCode());
            if (item.getCategory() == ItemCategory.POWER_UP) {
                purchase.setExpiresAt(LocalDateTime.now().plusDays(30));
            }
        }

        purchase = purchaseRepository.save(purchase);

        // Update stock
        item.setStock(item.getStock() - request.getQuantity());
        itemRepository.save(item);

        log.info("User {} purchased {}x {} for {} coins",
                user.getEmail(), request.getQuantity(), item.getName(), totalPrice);

        return mapToPurchaseResponse(purchase);
    }

    public List<PurchaseResponse> getMyPurchases(String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return purchaseRepository.findByUserIdOrderByPurchasedAtDesc(user.getId())
                .stream()
                .map(this::mapToPurchaseResponse)
                .collect(Collectors.toList());
    }

    public PurchaseResponse getPurchaseById(Long id, String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));

        if (!purchase.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return mapToPurchaseResponse(purchase);
    }

    @Transactional
    public PurchaseResponse redeemItem(Long purchaseId, String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));

        if (!purchase.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        if (purchase.getStatus() != PurchaseStatus.APPROVED) {
            throw new RuntimeException("Purchase not approved yet");
        }

        if (purchase.getUsedAt() != null) {
            throw new RuntimeException("Already redeemed");
        }

        // Activate power-up if applicable
        if (purchase.getItem().getCategory() == ItemCategory.POWER_UP) {
            activatePowerUp(purchase);
        }

        purchase.setUsedAt(LocalDateTime.now());
        purchase.setStatus(PurchaseStatus.USED);
        purchase = purchaseRepository.save(purchase);

        return mapToPurchaseResponse(purchase);
    }

    // ========== ADMIN ENDPOINTS ==========

    @Transactional
    public StoreItemResponse createItem(StoreItemRequest request) {
        StoreItem item = StoreItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .isActive(request.getIsActive())
                .requiresApproval(request.getRequiresApproval())
                .cooldownHours(request.getCooldownHours())
                .metadata(request.getMetadata())
                .build();

        item = itemRepository.save(item);
        log.info("Created store item: {}", item.getName());
        return mapToItemResponse(item);
    }

    @Transactional
    public StoreItemResponse updateItem(Long id, StoreItemRequest request) {
        StoreItem item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setPrice(request.getPrice());
        item.setStock(request.getStock());
        item.setImageUrl(request.getImageUrl());
        item.setIsActive(request.getIsActive());
        item.setRequiresApproval(request.getRequiresApproval());
        item.setCooldownHours(request.getCooldownHours());
        item.setMetadata(request.getMetadata());

        item = itemRepository.save(item);
        return mapToItemResponse(item);
    }

    @Transactional
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    @Transactional
    public StoreItemResponse updateStock(Long id, Integer stock) {
        StoreItem item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setStock(stock);
        item = itemRepository.save(item);
        return mapToItemResponse(item);
    }
    public List<PurchaseResponse> getAllPurchases() {
        return purchaseRepository.findAllWithDetails()
                .stream()
                .map(this::mapToPurchaseResponse)
                .collect(Collectors.toList());
    }

    public List<PurchaseResponse> getPendingPurchases() {
        return purchaseRepository.findByStatusWithDetails(PurchaseStatus.PENDING)
                .stream()
                .map(this::mapToPurchaseResponse)
                .collect(Collectors.toList());
    }
    @Transactional
    public PurchaseResponse approvePurchase(Long id, PurchaseApprovalRequest request,
                                            String approverEmail) {
        User approver = coUserRepository.findByEmail(approverEmail)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));

        if (purchase.getStatus() != PurchaseStatus.PENDING) {
            throw new RuntimeException("Purchase is not pending approval");
        }

        if (request.getApproved()) {
            purchase.setStatus(PurchaseStatus.APPROVED);
            purchase.setRedemptionCode(generateRedemptionCode());
            if (purchase.getItem().getCategory() == ItemCategory.POWER_UP) {
                purchase.setExpiresAt(LocalDateTime.now().plusDays(30));
            }
        } else {
            purchase.setStatus(PurchaseStatus.REJECTED);
            purchase.setRejectionReason(request.getRejectionReason());

            // Refund coins
            coinService.addCoins(
                    purchase.getUser(),
                    purchase.getTotalPrice(),
                    TransactionType.REFUND,
                    "Refund for rejected purchase: " + purchase.getItem().getName(),
                    null, null, null
            );
        }

        purchase.setApprovedBy(approver);
        purchase.setApprovedAt(LocalDateTime.now());
        purchase = purchaseRepository.save(purchase);

        return mapToPurchaseResponse(purchase);
    }

    // ========== HELPER METHODS ==========

    private void activatePowerUp(Purchase purchase) {
        String powerUpType = extractPowerUpType(purchase.getItem());

        ActivePowerUp powerUp = ActivePowerUp.builder()
                .user(purchase.getUser())
                .purchase(purchase)
                .powerUpType(powerUpType)
                .activatedAt(LocalDateTime.now())
                .expiresAt(calculatePowerUpExpiry(purchase.getItem()))
                .isActive(true)
                .build();

        powerUpRepository.save(powerUp);
    }

    private String extractPowerUpType(StoreItem item) {
        // Parse from metadata or name
        if (item.getName().contains("Double XP")) return "DOUBLE_XP";
        if (item.getName().contains("Hint")) return "HINT_MASTER";
        return "GENERIC_BOOST";
    }

    private LocalDateTime calculatePowerUpExpiry(StoreItem item) {
        int hours = item.getCooldownHours() != null ? item.getCooldownHours() : 72;
        return LocalDateTime.now().plusHours(hours);
    }

    private String generateRedemptionCode() {
        return String.format("%s-%s",
                UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                System.currentTimeMillis() % 10000);
    }

    private StoreItemResponse mapToItemResponse(StoreItem item) {
        return StoreItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory())
                .price(item.getPrice())
                .stock(item.getStock())
                .imageUrl(item.getImageUrl())
                .isActive(item.getIsActive())
                .requiresApproval(item.getRequiresApproval())
                .cooldownHours(item.getCooldownHours())
                .metadata(item.getMetadata())
                .build();
    }

    private PurchaseResponse mapToPurchaseResponse(Purchase purchase) {
        return PurchaseResponse.builder()
                .id(purchase.getId())
                .userId(purchase.getUser().getId())  // Add userId
                .userName(purchase.getUser().getName())  // Add userName if needed
                .itemId(purchase.getItem().getId())
                .itemName(purchase.getItem().getName())
                .itemCategory(purchase.getItem().getCategory().name())
                .quantity(purchase.getQuantity())
                .totalPrice(purchase.getTotalPrice())
                .status(purchase.getStatus())
                .purchasedAt(purchase.getPurchasedAt())
                .approvedAt(purchase.getApprovedAt())
                .approvedByName(purchase.getApprovedBy() != null ?
                        purchase.getApprovedBy().getName() : null)
                .rejectionReason(purchase.getRejectionReason())
                .redemptionCode(purchase.getRedemptionCode())
                .expiresAt(purchase.getExpiresAt())
                .usedAt(purchase.getUsedAt())
                .build();
    }
}
