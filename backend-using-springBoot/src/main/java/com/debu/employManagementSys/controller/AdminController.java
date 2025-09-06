package com.debu.employManagementSys.controller;

import com.debu.employManagementSys.dto.LoginRequest;
import com.debu.employManagementSys.model.Admin;
import com.debu.employManagementSys.service.AdminService;
import com.debu.employManagementSys.service.CaptchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private  AdminService service;
    @Autowired
    private CaptchaService captchaService;

    @PostMapping("/register")
    public Admin register(@RequestBody Admin admin) {
       return service.register(admin);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        if (!captchaService.verifyCaptcha(request.getCaptcha())) {
            return ResponseEntity.badRequest().body("Captcha verification failed");
        }

        Admin admin = new Admin();
        admin.setUsername(request.getUsername());
        admin.setPassword(request.getPassword());

        String result = service.verifyAdmin(admin);

        if (result == null || result.startsWith("Login failed")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } else {
            return ResponseEntity.ok(result);
        }
    }

}
