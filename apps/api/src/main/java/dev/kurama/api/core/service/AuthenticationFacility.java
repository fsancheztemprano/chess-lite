package dev.kurama.api.core.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import dev.kurama.api.core.authority.TokenAuthority;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.domain.support.AuthenticatedUser;
import dev.kurama.api.core.exception.domain.RoleCanNotLoginException;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.utility.JWTTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthenticationFacility {

  @NonNull
  private final UserService userService;

  @NonNull
  private final JWTTokenProvider jwtTokenProvider;

  @NonNull
  private final AuthenticationManager authenticationManager;

  @NonNull
  private final HttpServletRequest context;

  public AuthenticatedUser login(String username, String password)
    throws RoleCanNotLoginException, UserNotFoundException {
    validateCredentials(username, password);
    return authenticateUser(
      userService.findUserByUsername(username).orElseThrow(() -> new UserNotFoundException(username)));
  }

  public AuthenticatedUser refreshToken(String userId) throws UserNotFoundException, RoleCanNotLoginException {
    return authenticateUser(userService.findUserById(userId).orElseThrow(() -> new UserNotFoundException(userId)));
  }

  public void validateCredentials(String username, String password) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
  }

  private AuthenticatedUser authenticateUser(@NonNull User user) throws RoleCanNotLoginException {
    if (!user.getRole().isCanLogin()) {
      throw new RoleCanNotLoginException(user.getRole().getName());
    }
    if (user.isLocked()) {
      throw new LockedException(user.getUsername());
    }
    UserPrincipal userPrincipal = new UserPrincipal(user);
    var token = jwtTokenProvider.generateToken(userPrincipal);
    DecodedJWT decodedToken = jwtTokenProvider.getDecodedJWT(token);
    SecurityContextHolder.getContext().setAuthentication(jwtTokenProvider.getAuthentication(decodedToken, context));

    user.getAuthorities().removeIf(authority -> !authority.getName().equals(TokenAuthority.TOKEN_REFRESH));
    var refreshToken = jwtTokenProvider.generateRefreshToken(new UserPrincipal(user));

    return AuthenticatedUser.builder().user(user).token(token).refreshToken(refreshToken).build();
  }
}
