package com.namtienjsc.hr.config;

import com.namtienjsc.hr.entity.User;
import com.namtienjsc.hr.enums.Role;
import com.namtienjsc.hr.enums.UserStatus;
import com.namtienjsc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createUserIfNotExists(
                "EMP001",
                "Nhân viên Demo",
                "employee@namtienjsc.com",
                "123456",
                Role.EMPLOYEE,
                "Hành chính",
                "Nhân viên"
        );

        createUserIfNotExists(
                "MANAGER001",
                "Sếp Demo",
                "boss@namtienjsc.com",
                "123456",
                Role.MANAGER,
                "Ban giám đốc",
                "Quản lý"
        );
    }

    private void createUserIfNotExists(
            String employeeCode,
            String fullName,
            String email,
            String rawPassword,
            Role role,
            String department,
            String position
    ) {
        if (userRepository.existsByEmail(email)) {
            return;
        }

        User user = User.builder()
                .employeeCode(employeeCode)
                .fullName(fullName)
                .email(email)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(role)
                .department(department)
                .position(position)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);
    }
}