package dev.kurama.chess.backend.service;

import static dev.kurama.chess.backend.constant.UserConstant.EMAIL_ALREADY_EXISTS;
import static dev.kurama.chess.backend.constant.UserConstant.NO_USER_FOUND_BY_USERNAME;
import static dev.kurama.chess.backend.constant.UserConstant.USERNAME_ALREADY_EXISTS;
import static dev.kurama.chess.backend.domain.Role.USER_ROLE;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

import dev.kurama.chess.backend.domain.User;
import dev.kurama.chess.backend.domain.UserPrincipal;
import dev.kurama.chess.backend.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.exception.domain.UserNotFoundException;
import dev.kurama.chess.backend.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.repository.UserRepository;
import java.util.Date;
import javax.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Flogger
@RequiredArgsConstructor
@Service
@Transactional
@Qualifier("userDetailsService")
public class UserService implements UserDetailsService {

  @NonNull
  private final UserRepository userRepository;
  @NonNull
  private final BCryptPasswordEncoder passwordEncoder;
  @NonNull
  private final LoginAttemptService loginAttemptService;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findUserByUsername(username);
    if (user == null) {
      throw new UsernameNotFoundException("User not found by username: " + username);
    } else {
      validateLoginAttempt(user);
      user.setLastLoginDateDisplay(user.getLastLoginDate());
      user.setLastLoginDate(new Date());
      userRepository.save(user);
      return new UserPrincipal(user);
    }
  }

  public User findUserByUsername(String username) {
    return userRepository.findUserByUsername(username);
  }

  public User findUserByEmail(String email) {
    return userRepository.findUserByEmail(email);
  }

  public User register(String firstName, String lastName, String username, String email)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    validateNewUsernameAndEmail(EMPTY, username, email);
    String password = randomAlphanumeric(10);
    var user = User.builder()
      .userId(randomNumeric(10))
      .firstName(firstName)
      .lastName(lastName)
      .username(username)
      .email(email)
      .joinDate(new Date())
      .password(passwordEncoder.encode(password))
      .isActive(true)
      .isLocked(false)
      .isExpired(false)
      .isCredentialsExpired(false)
      .role(USER_ROLE.name())
      .authorities(USER_ROLE.getAuthorities()).build();
    userRepository.save(user);
    log.atInfo().log("New user password: " + password);
    return user;
  }


  private User validateNewUsernameAndEmail(String currentUsername, String newUsername, String email)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    var userByNewUsername = findUserByUsername(newUsername);
    var userByNewEmail = findUserByEmail(email);
    if (isNotBlank(currentUsername)) {
      var currentUser = findUserByUsername(currentUsername);
      if (currentUser == null) {
        throw new UserNotFoundException(NO_USER_FOUND_BY_USERNAME + currentUsername);
      }
      if (userByNewUsername != null && !currentUser.getId().equals(userByNewUsername.getId())) {
        throw new UsernameExistsException(USERNAME_ALREADY_EXISTS + currentUsername);
      }
      if (userByNewEmail != null && !currentUser.getId().equals(userByNewEmail.getId())) {
        throw new EmailExistsException(EMAIL_ALREADY_EXISTS + email);
      }
      return currentUser;
    } else {
      if (userByNewUsername != null) {
        throw new UsernameExistsException(USERNAME_ALREADY_EXISTS + currentUsername);
      }
      if (userByNewEmail != null) {
        throw new EmailExistsException(EMAIL_ALREADY_EXISTS + email);
      }
      return null;
    }
  }

  private void validateLoginAttempt(User user) {
    if (user.isLocked()) {
      loginAttemptService.evictUserFromLoginAttemptCache(user.getUsername());
    } else {
      user.setLocked(loginAttemptService.hasExceededMaxAttempts(user.getUsername()));
    }
  }
}
