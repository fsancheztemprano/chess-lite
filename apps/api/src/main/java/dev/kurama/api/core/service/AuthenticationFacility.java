package dev.kurama.api.core.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.exception.domain.RoleCanNotLoginException;
import dev.kurama.api.core.utility.JWTTokenProvider;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

  public Pair<User, String> login(String username, String password) throws RoleCanNotLoginException {
    verifyAuthentication(username, password);
    var user = userService.findUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    if (!user.getRole().isCanLogin()) {
      throw new RoleCanNotLoginException(user.getRole().getName());
    }
    if (user.isLocked()) {
      throw new LockedException(username);
    }
    return authenticateUser(user);
  }

  public void verifyAuthentication(String username, String password) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
  }

  private Pair<User, String> authenticateUser(User user) {
    UserPrincipal userPrincipal = new UserPrincipal(user);
    var token = jwtTokenProvider.generateJWTToken(userPrincipal);
    DecodedJWT decodedToken = jwtTokenProvider.getDecodedJWT(token);
    SecurityContextHolder.getContext().setAuthentication(jwtTokenProvider.getAuthentication(decodedToken, null));

    return Pair.of(user, jwtTokenProvider.generateJWTToken(userPrincipal));
  }
}
