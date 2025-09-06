package com.debu.employManagementSys.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaService {

    @Value("${recaptcha.secret}")
    private String recaptchaSecret;

    @Value("${recaptcha.verify.url}")
    private String recaptchaVerifyUrl;


    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean verifyCaptcha(String captchaResponse) {
        if (captchaResponse == null || captchaResponse.isEmpty()) return false;
        try {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("secret", recaptchaSecret);
            form.add("response", captchaResponse);

            String resp = restTemplate.postForObject(recaptchaVerifyUrl, form, String.class);
            JsonNode json = objectMapper.readTree(resp);

            boolean success = json.path("success").asBoolean(false);
            System.out.println("Captcha verification response: " + resp);
            return success;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


}
