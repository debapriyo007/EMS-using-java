package com.debu.employManagementSys.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Objects;
import java.util.function.Function;

@Service
public class JwtService {

    //i've to be generated the secretkey.
    private String secretKey = "";

    public JwtService(){
        try{
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey genKey = keyGen.generateKey();
            //now convert secretkey into string.
            secretKey = Base64.getEncoder().encodeToString(genKey.getEncoded());
        }catch(NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }


    private SecretKey getKey() {
        byte[]keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    //now i've to be generated token base on the username.
    public String generateToken(String username){
        HashMap<String, Objects> claims = new HashMap<>();
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() * 1000 * 60 * 30)) //30 minutes
                .and()
                .signWith(getKey())
                .compact();



    }

    private Claims extractsAllClaims(String token){
        return
                Jwts.parser()
                        .verifyWith(getKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();
    }
    private <T> T extractClaims(String token , Function<Claims, T> claimsResolver){
        final Claims claims = extractsAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Date extractExpiration(String token){
        return extractClaims(token, Claims::getExpiration);
    }

    public String extractUsername(String token){
        return extractClaims(token, Claims::getSubject);
    }

    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

}
