package com.debu.employManagementSys.service;

import com.debu.employManagementSys.model.Admin;
import com.debu.employManagementSys.repo.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepo repo;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public Admin register(Admin admin) {
        admin.setPassword(encoder.encode(admin.getPassword()));
        return repo.save(admin);
    }

    public String verifyAdmin(Admin admin) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(admin.getUsername(), admin.getPassword()));

        if(authentication.isAuthenticated()){
            return jwtService.generateToken(admin.getUsername());
        } else {
            return "Login failed for admin " + admin.getUsername() + ". Please check your credentials.";
        }
    }
}
