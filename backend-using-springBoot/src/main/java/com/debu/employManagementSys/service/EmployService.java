package com.debu.employManagementSys.service;

import com.debu.employManagementSys.model.Employ;
import com.debu.employManagementSys.repo.EmployRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployService {

    @Autowired
    private EmployRepo repo;


    public Employ addEmploy(Employ employ) {
        return repo.save(employ);
    }

    public List<Employ> getAllEmploys() {
        return repo.findAll();
    }


    public void deleteEmploy(int id) {
        repo.deleteById(id);
    }

    public List<Employ> searchEmploys(String keyword) {
        return repo.searchEmploy(keyword);
    }
}
