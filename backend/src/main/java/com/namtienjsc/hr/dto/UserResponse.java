package com.namtienjsc.hr.dto;

import com.namtienjsc.hr.entity.User;
import com.namtienjsc.hr.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String employeeCode;
    private String fullName;
    private String email;
    private Role role;
    private String department;
    private String position;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .employeeCode(user.getEmployeeCode())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .department(user.getDepartment())
                .position(user.getPosition())
                .build();
    }
}
