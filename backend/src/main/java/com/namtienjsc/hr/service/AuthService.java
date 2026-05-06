package com.namtienjsc.hr.service;

import com.namtienjsc.hr.dto.LoginResponse;
import com.namtienjsc.hr.dto.LoginRequest;
import com.namtienjsc.hr.dto.UserResponse;
import com.namtienjsc.hr.entity.User;
import com.namtienjsc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng");
        }

        String token = jwtService.generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .user(UserResponse.fromEntity(user))
                .build();
    }
}
