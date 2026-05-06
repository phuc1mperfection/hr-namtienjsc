package com.namtienjsc.hr.config;

import com.namtienjsc.hr.entity.User;
import com.namtienjsc.hr.repository.UserRepository;
import com.namtienjsc.hr.service.CustomUserDetailsService;
import com.namtienjsc.hr.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");
        log.debug("Authorization header: {}", authorizationHeader);

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);
        String email;

        try {
            email = jwtService.extractEmail(token);
            log.debug("Extracted email from token: {}", email);
        } catch (Exception ex) {
            log.warn("Failed to extract email from token", ex);
            filterChain.doFilter(request, response);
            return;
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails;
            User user;

            try {
                userDetails = customUserDetailsService.loadUserByUsername(email);
                user = userRepository.findByEmail(email).orElse(null);
                log.debug("Loaded user: {}", user);
            } catch (UsernameNotFoundException ex) {
                log.warn("User not found for email: {}", email);
                filterChain.doFilter(request, response);
                return;
            }

            if (user != null && jwtService.isTokenValid(token, user)) {
                log.info("Token is valid for user: {}", email);
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                log.debug("Authentication set for user: {}", email);
            } else {
                log.warn("Token validation failed or user not found. User: {}, Token valid: {}",
                        user != null ? user.getEmail() : null, user != null && jwtService.isTokenValid(token, user));
            }
        }

        filterChain.doFilter(request, response);
    }
}