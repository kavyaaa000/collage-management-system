package com.college.erp.connect.repository;

import com.college.erp.connect.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreItemRepository extends JpaRepository<StoreItem, Long> {
    List<StoreItem> findByIsActiveTrueOrderByCategory();
    List<StoreItem> findByCategoryAndIsActiveTrue(ItemCategory category);
    List<StoreItem> findByStockGreaterThan(Integer stock);
}