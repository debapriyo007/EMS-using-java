package com.debu.employManagementSys.repo;

import com.debu.employManagementSys.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepo extends JpaRepository<Admin, Long> {
    Admin findByUsername(String username);
}
