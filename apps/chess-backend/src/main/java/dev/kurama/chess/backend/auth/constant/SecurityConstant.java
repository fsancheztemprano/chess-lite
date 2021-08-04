package dev.kurama.chess.backend.auth.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SecurityConstant {

  public static final long EXPIRATION_TIME = 432_000_000; // 5 days expressed in milliseconds
  public static final String TOKEN_PREFIX = "Bearer ";
  public static final String JWT_TOKEN_HEADER = "Jwt-Token";
  public static final String TOKEN_CANNOT_BE_VERIFIED = "Token cannot be verified";
  public static final String AUTH_ISSUER = "Chess Lite";
  public static final String AUTH_AUDIENCE = "User Management Portal";
  public static final String AUTHORITIES = "authorities";
  public static final String FORBIDDEN_MESSAGE = "You need to log in to access this page";
  public static final String ACCESS_DENIED_MESSAGE = "You do not have permission to access this page";
  public static final String[] PUBLIC_URLS = {"/api/auth/login", "/api/auth/signup", "/api"};
  public static final String[] DEVELOPMENT_PUBLIC_URLS = {"/api/auth/login", "/api/auth/signup", "/api",
    "/swagger-ui/**", "/swagger-resources/**", "/v*/api-docs/**", "/book/**", "/author/**"};

}
