package com.caballeriza.backend.config;

import com.caballeriza.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationProvider authenticationProvider
    ) throws Exception {

        return http
                .csrf(AbstractHttpConfigurer::disable)

                .cors(cors -> cors.configurationSource(
                        corsConfigurationSource()
                ))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(exception -> exception

                        .authenticationEntryPoint(
                                (request, response, authException) -> {
                                    response.setStatus(401);
                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.getWriter().write(
                                            "{\"error\":\"No autenticado\"}"
                                    );
                                }
                        )

                        .accessDeniedHandler(
                                (request, response, accessDeniedException) -> {
                                    response.setStatus(403);
                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.getWriter().write(
                                            "{\"error\":\"Acceso denegado\"}"
                                    );
                                }
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        /*
                         * Solicitudes necesarias para CORS.
                         */
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        /*
                         * Swagger y documentación de la API.
                         */
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        /*
                         * Registro e inicio de sesión.
                         */
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/register",
                                "/api/auth/login"
                        ).permitAll()

                        .requestMatchers(
                                "/error"
                        ).permitAll()

                        /*
                         * Solo el administrador puede eliminar
                         * registros de la API.
                         */
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/**"
                        ).hasRole("ADMINISTRADOR")

                        /*
                         * Administración de usuarios.
                         */
                        .requestMatchers(
                                "/api/users/**"
                        ).hasRole("ADMINISTRADOR")

                        /*
                         * Administración de empleados.
                         */
                        .requestMatchers(
                                "/api/employees/**"
                        ).hasRole("ADMINISTRADOR")

                        /*
                         * Historial médico.
                         */
                        .requestMatchers(
                                "/api/medical-history/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "VETERINARIO"
                        )

                        /*
                         * Turnos y tareas.
                         */
                        .requestMatchers(
                                "/api/shifts/**",
                                "/api/tasks/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "CUIDADOR"
                        )

                        /*
                         * Alimentación, inventario,
                         * suministros y alertas.
                         */
                        .requestMatchers(
                                "/api/inventory/**",
                                "/api/feeding-plans/**",
                                "/api/supply-records/**",
                                "/api/alerts/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "CUIDADOR",
                                "VETERINARIO"
                        )

                        /*
                         * Todos los usuarios autenticados
                         * pueden consultar caballos y reservas.
                         */
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/horses/**",
                                "/api/reservations/**"
                        ).authenticated()

                        /*
                         * Administración de caballos.
                         */
                        .requestMatchers(
                                "/api/horses/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "CUIDADOR",
                                "VETERINARIO"
                        )

                        /*
                         * Creación de reservas.
                         */
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/reservations/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "CUIDADOR",
                                "CLIENTE"
                        )

                        /*
                         * Modificación y administración
                         * de reservas.
                         */
                        .requestMatchers(
                                "/api/reservations/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "CUIDADOR"
                        )

                        /*
                         * Cualquier otra ruta requiere
                         * autenticación.
                         */
                        .anyRequest().authenticated()
                )

                .authenticationProvider(
                        authenticationProvider
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .formLogin(
                        AbstractHttpConfigurer::disable
                )

                .httpBasic(
                        AbstractHttpConfigurer::disable
                )

                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        userDetailsService
                );

        provider.setPasswordEncoder(
                passwordEncoder
        );

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration
                .getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
                List.of(
                        "http://localhost:*",
                        "http://127.0.0.1:*"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}