package com.debu.employManagementSys.repo;

import com.debu.employManagementSys.model.Employ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployRepo extends JpaRepository<Employ, Integer>{

    //Add search function by keyword

    @Query("SELECT e FROM Employ e " +
                    "WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR LOWER(e.designation) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR LOWER(e.department) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR CONCAT(e.salary, '') LIKE CONCAT('%', :keyword, '%')")

    List<Employ>searchEmploy(String keyword);
}
