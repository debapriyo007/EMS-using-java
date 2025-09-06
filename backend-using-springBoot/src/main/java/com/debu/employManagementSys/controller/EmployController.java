package com.debu.employManagementSys.controller;

import com.debu.employManagementSys.model.Employ;
import com.debu.employManagementSys.service.EmployService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class EmployController {

    @Autowired
    private EmployService service;

    @PostMapping("/add-employ")
    public ResponseEntity<Employ> addEmploy(@RequestBody  Employ employ){
        System.out.println("Sending Employ info : " + employ);

        if(employ.getName() == null || employ.getEmail() == null ||
           employ.getDesignation() == null || employ.getDepartment() == null ||
           employ.getSalary() == 0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(service.addEmploy(employ), HttpStatus.OK);
    }

    @GetMapping("get-all-employs")
    public ResponseEntity<List<Employ>>getAllEmploys(){
        return new ResponseEntity<>(service.getAllEmploys(), HttpStatus.OK);
    }

    @DeleteMapping("/delete-employ/{id}")
    public ResponseEntity<String> deleteEmploy(@PathVariable int id){
        service.deleteEmploy(id);
        return new ResponseEntity<>("Employ Deleted Successfully", HttpStatus.OK);
    }

    @PutMapping("/update-employ/{id}")
    public ResponseEntity<Employ> updateEmploy(@PathVariable int id, @RequestBody Employ employ){
        List<Employ> employs = service.getAllEmploys();
        for(Employ e : employs){
            if(e.getId() == id){
                e.setName(employ.getName());
                e.setEmail(employ.getEmail());
                e.setDesignation(employ.getDesignation());
                e.setDepartment(employ.getDepartment());
                e.setSalary(employ.getSalary());
                return new ResponseEntity<>(service.addEmploy(e), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    //if someone want to type any keyword related to employ he get all employs related to that keyword
    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<Employ>>searchbyKeyword(@PathVariable String keyword){
        return new ResponseEntity<>(service.searchEmploys(keyword), HttpStatus.OK);
    }

}
