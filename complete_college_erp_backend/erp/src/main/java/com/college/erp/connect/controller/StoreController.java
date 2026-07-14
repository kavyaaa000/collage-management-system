package com.college.erp.connect.controller;

import com.college.erp.connect.dto.*;
import com.college.erp.connect.entity.ItemCategory;
import com.college.erp.connect.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connect/store")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @GetMapping("/items")
    public ResponseEntity<?> getAllItems() {
        try {
            List<StoreItemResponse> items = storeService.getAllActiveItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        try {
            StoreItemResponse item = storeService.getItemById(id);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/items/category/{category}")
    public ResponseEntity<?> getItemsByCategory(@PathVariable String category) {
        try {
            ItemCategory cat = ItemCategory.valueOf(category.toUpperCase());
            List<StoreItemResponse> items = storeService.getItemsByCategory(cat);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchaseItem(@Valid @RequestBody PurchaseRequest request,
                                          Authentication authentication) {
        try {
            PurchaseResponse purchase = storeService.purchaseItem(
                    request, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(purchase);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/purchases/my")
    public ResponseEntity<?> getMyPurchases(Authentication authentication) {
        try {
            List<PurchaseResponse> purchases =
                    storeService.getMyPurchases(authentication.getName());
            return ResponseEntity.ok(purchases);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/purchases/{id}")
    public ResponseEntity<?> getPurchaseById(@PathVariable Long id,
                                             Authentication authentication) {
        try {
            PurchaseResponse purchase = storeService.getPurchaseById(
                    id, authentication.getName());
            return ResponseEntity.ok(purchase);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/purchases/{id}/redeem")
    public ResponseEntity<?> redeemItem(@PathVariable Long id,
                                        Authentication authentication) {
        try {
            PurchaseResponse purchase = storeService.redeemItem(
                    id, authentication.getName());
            return ResponseEntity.ok(purchase);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}