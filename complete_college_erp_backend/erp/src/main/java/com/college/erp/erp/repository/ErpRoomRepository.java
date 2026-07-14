package com.college.erp.erp.repository;

import com.college.erp.erp.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ErpRoomRepository extends JpaRepository<Room, Integer> {
    List<Room> findByFloorId(Integer floorId);
    List<Room> findByRoomTypeId(Integer roomTypeId);
    boolean existsByRoomCode(String roomCode);
}