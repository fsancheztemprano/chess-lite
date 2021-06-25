package dev.kurama.chess.backend.auth.service;

import static dev.kurama.chess.backend.auth.constant.UserConstant.EMAIL_ALREADY_EXISTS;
import static dev.kurama.chess.backend.auth.constant.UserConstant.NO_USER_FOUND_BY_USERNAME;
import static dev.kurama.chess.backend.auth.constant.UserConstant.USERNAME_ALREADY_EXISTS;
import static dev.kurama.chess.backend.auth.domain.Role.USER_ROLE;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

import dev.kurama.chess.backend.auth.domain.Role;
import dev.kurama.chess.backend.auth.domain.User;
import dev.kurama.chess.backend.auth.domain.UserPrincipal;
import dev.kurama.chess.backend.auth.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.auth.exception.domain.UserNotFoundException;
import dev.kurama.chess.backend.auth.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.auth.repository.UserRepository;
import dev.kurama.chess.backend.auth.rest.input.UserInput;
import java.util.Date;
import java.util.List;
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

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public void deleteUser(String username) {
    var user = userRepository.findUserByUsername(username);
    userRepository.deleteById(user.getId());
  }

  public User register(String username, String password, String email, String firstName, String lastName)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    validateNewUsernameAndEmail(EMPTY, username, email);
    var user = User.builder()
      .userId(randomNumeric(10))
      .username(username)
      .password(passwordEncoder.encode(password))
      .email(email)
      .firstName(firstName)
      .lastName(lastName)
      .joinDate(new Date())
      .isActive(true)
      .isLocked(false)
      .isExpired(false)
      .isCredentialsExpired(false)
      .role(USER_ROLE.name())
      .authorities(USER_ROLE.getAuthorities()).build();
    userRepository.save(user);
    log.atInfo().log(String.format("New user registered: %s:%s", username, password));
    return user;
  }

  public User createUser(UserInput userInput)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    validateNewUsernameAndEmail(EMPTY, userInput.getUsername(), userInput.getEmail());
    User user = User.builder()
      .userId(randomNumeric(10))
      .username(userInput.getUsername())
      .password(passwordEncoder.encode(userInput.getPassword()))
      .email(userInput.getEmail())
      .firstName(userInput.getFirstName())
      .lastName(userInput.getLastName())
      .joinDate(new Date())
      .isActive(userInput.isActive())
      .isLocked(userInput.isLocked())
      .isExpired(userInput.isExpired())
      .isCredentialsExpired(userInput.isCredentialsExpired())
      .role(getRoleEnumName(userInput.getRole()).name())
      .authorities(getRoleEnumName(userInput.getRole()).getAuthorities()).build();
    userRepository.save(user);
    log.atInfo().log(String.format("New user registered: %s:%s", user.getUsername(), user.getPassword()));
    return user;
  }

  public User updateUser(String username, UserInput userInput)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    User currentUser = validateNewUsernameAndEmail(username, userInput.getUsername(), userInput.getEmail());
    currentUser.setEmail(userInput.getEmail());
    currentUser.setFirstName(userInput.getFirstName());
    currentUser.setLastName(userInput.getLastName());
    currentUser.setActive(userInput.isActive());
    currentUser.setLocked(userInput.isLocked());
    currentUser.setExpired(userInput.isExpired());
    currentUser.setCredentialsExpired(userInput.isCredentialsExpired());
    currentUser.setRole(getRoleEnumName(userInput.getRole()).name());
    currentUser.setAuthorities(getRoleEnumName(userInput.getRole()).getAuthorities());
    userRepository.save(currentUser);
    return currentUser;
  }

  private Role getRoleEnumName(String role) {
    return Role.valueOf(role.toUpperCase());
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
