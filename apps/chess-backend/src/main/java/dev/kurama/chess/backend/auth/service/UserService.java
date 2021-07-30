package dev.kurama.chess.backend.auth.service;

import static dev.kurama.chess.backend.auth.constant.UserConstant.EMAIL_ALREADY_EXISTS;
import static dev.kurama.chess.backend.auth.constant.UserConstant.NO_USER_FOUND_BY_ID;
import static dev.kurama.chess.backend.auth.constant.UserConstant.NO_USER_FOUND_BY_USERNAME;
import static dev.kurama.chess.backend.auth.constant.UserConstant.USERNAME_ALREADY_EXISTS;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

import dev.kurama.chess.backend.auth.api.domain.input.UpdateUserProfileInput;
import dev.kurama.chess.backend.auth.api.domain.input.UserInput;
import dev.kurama.chess.backend.auth.domain.User;
import dev.kurama.chess.backend.auth.domain.UserPrincipal;
import dev.kurama.chess.backend.auth.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.auth.exception.domain.UserNotFoundException;
import dev.kurama.chess.backend.auth.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.auth.repository.UserRepository;
import java.util.Date;
import java.util.Optional;
import javax.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

  @NonNull
  private final RoleService roleService;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    var user = userRepository.findUserByUsername(username)
      .orElseThrow(() -> new UsernameNotFoundException("User not found by username: " + username));
    validateLoginAttempt(user);
    user.setLastLoginDateDisplay(user.getLastLoginDate());
    user.setLastLoginDate(new Date());
    userRepository.save(user);
    return new UserPrincipal(user);
  }

  public Optional<User> findUserById(String id) {
    return userRepository.findUserById(id);
  }

  public Optional<User> findUserByUsername(String username) {
    return userRepository.findUserByUsername(username);
  }

  public Optional<User> findUserByEmail(String email) {
    return userRepository.findUserByEmail(email);
  }

  public Page<User> getAllUsers(Pageable pageable) {
    return userRepository.findAll(pageable);
  }

  public void deleteUserByUsername(String username) {
    var user = userRepository.findUserByUsername(username).orElseThrow();
    userRepository.deleteById(user.getTid());
  }

  public void deleteUserById(String id) {
    var user = userRepository.findUserById(id).orElseThrow();
    userRepository.deleteById(user.getTid());
  }

  public User signup(String username, String password, String email, String firstname, String lastname)
    throws UsernameExistsException, EmailExistsException {
    validateUsernameAndEmailCreate(username, email);
    var role = roleService.getDefaultRole().orElseThrow();
    User user = User.builder()
      .setRandomUUID()
      .username(username)
      .password(passwordEncoder.encode(password))
      .email(email)
      .firstname(firstname)
      .lastname(lastname)
      .joinDate(new Date())
      .active(true)
      .locked(false)
      .expired(false)
      .credentialsExpired(false)
      .role(role)
      .authorities(role.getAuthorities())
      .build();
    userRepository.save(user);
    log.atInfo().log(String.format("New user signed up: %s:%s", username, password));
    return user;
  }

  public User createUser(UserInput userInput)
    throws UsernameExistsException, EmailExistsException {
    validateUsernameAndEmailCreate(userInput.getUsername(), userInput.getEmail());
    var role = roleService.findByName(userInput.getRole()).orElseThrow();
    User user = User.builder()
      .setRandomUUID()
      .username(userInput.getUsername())
      .password(passwordEncoder.encode(userInput.getPassword()))
      .email(userInput.getEmail())
      .firstname(userInput.getFirstname())
      .lastname(userInput.getLastname())
      .joinDate(new Date())
      .active(userInput.isActive())
      .locked(userInput.isLocked())
      .expired(userInput.isExpired())
      .credentialsExpired(userInput.isCredentialsExpired())
      .role(role)
      .authorities(role.getAuthorities())
      .build();
    userRepository.save(user);
    log.atInfo().log(String.format("New user signed up: %s:%s", user.getUsername(), user.getPassword()));
    return user;
  }

  public User updateUser(String id, UserInput userInput)
    throws UsernameExistsException, EmailExistsException, UserNotFoundException {
    var currentUser = validateUsernameAndEmailUpdate(id, userInput.getUsername(), userInput.getEmail());
    var role = roleService.findByName(userInput.getRole()).orElseThrow();
    currentUser.setEmail(userInput.getEmail());
    currentUser.setFirstname(userInput.getFirstname());
    currentUser.setLastname(userInput.getLastname());
    currentUser.setActive(userInput.isActive());
    currentUser.setLocked(userInput.isLocked());
    currentUser.setExpired(userInput.isExpired());
    currentUser.setCredentialsExpired(userInput.isCredentialsExpired());
    currentUser.setRole(role);
    currentUser.setAuthorities(role.getAuthorities());
    userRepository.save(currentUser);
    return currentUser;
  }

  public User updateProfile(String username, UpdateUserProfileInput updateProfileInput) {
    var currentUser = findUserByUsername(username).orElseThrow();
    currentUser.setFirstname(updateProfileInput.getFirstname());
    currentUser.setLastname(updateProfileInput.getLastname());
    currentUser.setProfileImageUrl(updateProfileInput.getProfileImageUrl());
    userRepository.save(currentUser);
    return currentUser;
  }

  public User updatePassword(String username, String newPassword) {
    var currentUser = findUserByUsername(username).orElseThrow();
    currentUser.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(currentUser);
    return currentUser;
  }

  private void validateUsernameAndEmailCreate(String newUsername, String email)
    throws UsernameExistsException, EmailExistsException {
    var userByNewUsername = findUserByUsername(newUsername);
    var userByNewEmail = findUserByEmail(email);
    if (userByNewUsername.isPresent()) {
      throw new UsernameExistsException(USERNAME_ALREADY_EXISTS + newUsername);
    }
    if (userByNewEmail.isPresent()) {
      throw new EmailExistsException(EMAIL_ALREADY_EXISTS + email);
    }
  }

  private User validateUsernameAndEmailUpdate(String id, String newUsername, String email)
    throws UsernameExistsException, EmailExistsException, UserNotFoundException {
    var userByNewUsername = findUserById(newUsername);
    if (userByNewUsername.isPresent() && isNotBlank(id)) {
      var currentUser = findUserById(id);
      if (currentUser.isEmpty()) {
        throw new UserNotFoundException(NO_USER_FOUND_BY_ID + id);
      }
      if (!currentUser.get().getId().equals(userByNewUsername.get().getId())) {
        throw new UsernameExistsException(USERNAME_ALREADY_EXISTS + newUsername);
      }
      var userByNewEmail = findUserByEmail(email);
      if (userByNewEmail.isPresent() && !currentUser.get().getId().equals(userByNewEmail.get().getId())) {
        throw new EmailExistsException(EMAIL_ALREADY_EXISTS + email);
      }
      return currentUser.get();
    } else {
      throw new UserNotFoundException(NO_USER_FOUND_BY_USERNAME + id);
    }
  }

  private void validateLoginAttempt(User user) {
    if (user.isLocked()) {
      loginAttemptService.evictUserFromLoginAttemptCache(user.getUsername());
    } else {
      user.setLocked(loginAttemptService.hasExceededMaxAttempts(user.getUsername()));
    }
  }

  public User uploadAvatar(String username, String avatar) {
    var currentUser = findUserByUsername(username).orElseThrow();
    currentUser.setProfileImageUrl(avatar);
    userRepository.save(currentUser);
    return currentUser;
  }
}
