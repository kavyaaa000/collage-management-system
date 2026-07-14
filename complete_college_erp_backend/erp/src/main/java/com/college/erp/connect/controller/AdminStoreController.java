package com.college.erp.connect.controller;

import com.college.erp.connect.dto.*;
import com.college.erp.connect.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connect/admin/store")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStoreController {

    private final StoreService storeService;

    @PostMapping("/items")
    public ResponseEntity<?> createItem(@Valid @RequestBody StoreItemRequest request) {
        try {
            StoreItemResponse item = storeService.createItem(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id,
                                        @Valid @RequestBody StoreItemRequest request) {
        try {
            StoreItemResponse item = storeService.updateItem(id, request);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            storeService.deleteItem(id);
            return ResponseEntity.ok(Map.of("message", "Item deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/items/{id}/stock")
    public ResponseEntity<?> updateStock(@PathVariable Long id,
                                         @RequestBody Map<String, Integer> request) {
        try {
            Integer stock = request.get("stock");
            if (stock == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Stock value required"));
            }
            StoreItemResponse item = storeService.updateStock(id, stock);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/purchases")
    public ResponseEntity<?> getAllPurchases() {
        try {
            List<PurchaseResponse> purchases = storeService.getAllPurchases();
            return ResponseEntity.ok(purchases);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/purchases/pending")
    public ResponseEntity<?> getPendingPurchases() {
        try {
            List<PurchaseResponse> purchases = storeService.getPendingPurchases();
            return ResponseEntity.ok(purchases);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/purchases/{id}/approve")
    public ResponseEntity<?> approvePurchase(@PathVariable Long id,
                                             @Valid @RequestBody PurchaseApprovalRequest request,
                                             Authentication authentication) {
        try {
            PurchaseResponse purchase = storeService.approvePurchase(
                    id, request, authentication.getName());
            return ResponseEntity.ok(purchase);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}