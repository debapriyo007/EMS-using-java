package com.debu.employManagementSys.service;

import com.debu.employManagementSys.model.Admin;
import com.debu.employManagementSys.repo.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService{

    @Autowired
    AdminRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = repo.findByUsername(username);
        if(admin == null){
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return User.withUsername(admin.getUsername())
                .password(admin.getPassword())
                .authorities("ADMIN")
                .build();
    }
}
