package com.college.erp.erp.repository;

import com.college.erp.erp.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {
    boolean existsByRoomTypeName(String roomTypeName);
}