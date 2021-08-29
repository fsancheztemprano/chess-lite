package dev.kurama.api.core.service;

import static java.util.Optional.ofNullable;

import com.google.common.collect.Sets;
import dev.kurama.api.core.constant.UserConstant;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.exception.domain.EmailExistsException;
import dev.kurama.api.core.exception.domain.RoleNotFoundException;
import dev.kurama.api.core.exception.domain.UserNotFoundException;
import dev.kurama.api.core.exception.domain.UsernameExistsException;
import dev.kurama.api.core.hateoas.input.UpdateUserProfileInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.repository.UserRepository;
import java.util.Date;
import java.util.Optional;
import java.util.Set;
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

  @NonNull
  private final AuthorityService authorityService;

  @NonNull
  private final UserPreferencesService userPreferencesService;

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
      .authorities(Sets.newHashSet(role.getAuthorities()))
      .build();
    user = userRepository.save(user);

    userPreferencesService.createUserPreferences(user);
    return user;
  }

  public User createUser(UserInput userInput)
    throws UsernameExistsException, EmailExistsException {
    validateUsernameAndEmailCreate(userInput.getUsername(), userInput.getEmail());
    var role = roleService.findRoleById(userInput.getRoleId())
      .orElseGet(() -> roleService.getDefaultRole().orElseThrow());
    User user = User.builder()
      .setRandomUUID()
      .username(userInput.getUsername())
      .password(passwordEncoder.encode(userInput.getPassword()))
      .email(userInput.getEmail())
      .firstname(userInput.getFirstname())
      .lastname(userInput.getLastname())
      .joinDate(new Date())
      .active(userInput.getActive())
      .locked(userInput.getLocked())
      .expired(userInput.getExpired())
      .credentialsExpired(userInput.getCredentialsExpired())
      .role(role)
      .authorities(Sets.newHashSet(role.getAuthorities()))
      .build();
    user = userRepository.save(user);

    userPreferencesService.createUserPreferences(user);
    return user;
  }

  public User updateUser(String id, UserInput userInput)
    throws EmailExistsException, UsernameExistsException, UserNotFoundException, RoleNotFoundException {
    var currentUser = findUserById(id).orElseThrow(
      () -> new UserNotFoundException(UserConstant.NO_USER_FOUND_BY_ID + id));
    if (ofNullable(userInput.getEmail()).isPresent() && !currentUser.getEmail()
      .equalsIgnoreCase(userInput.getEmail())) {
      if (findUserByEmail(userInput.getEmail()).isPresent()) {
        throw new EmailExistsException(UserConstant.EMAIL_ALREADY_EXISTS + userInput.getEmail());
      }
      currentUser.setEmail(userInput.getEmail());
    }
    if (ofNullable(userInput.getUsername()).isPresent() && !currentUser.getUsername()
      .equalsIgnoreCase(userInput.getUsername())) {
      if (findUserByUsername(userInput.getUsername()).isPresent()) {
        throw new UsernameExistsException(UserConstant.USERNAME_ALREADY_EXISTS + userInput.getUsername());
      }
      currentUser.setUsername(userInput.getUsername());
    }
    if (ofNullable(userInput.getPassword()).isPresent()) {
      currentUser.setPassword(passwordEncoder.encode(userInput.getPassword()));
    }
    if (ofNullable(userInput.getFirstname()).isPresent()) {
      currentUser.setFirstname(userInput.getFirstname());
    }
    if (ofNullable(userInput.getLastname()).isPresent()) {
      currentUser.setLastname(userInput.getLastname());
    }
    if (ofNullable(userInput.getActive()).isPresent()) {
      currentUser.setActive(userInput.getActive());
    }
    if (ofNullable(userInput.getLocked()).isPresent()) {
      currentUser.setLocked(userInput.getLocked());
    }
    if (ofNullable(userInput.getExpired()).isPresent()) {
      currentUser.setExpired(userInput.getExpired());
    }
    if (ofNullable(userInput.getCredentialsExpired()).isPresent()) {
      currentUser.setCredentialsExpired(userInput.getCredentialsExpired());
    }
    if (ofNullable(userInput.getRoleId()).isPresent()) {
      var role = roleService.findRoleById(userInput.getRoleId())
        .orElseThrow(() -> new RoleNotFoundException(userInput.getRoleId()));
      currentUser.setRole(role);
      currentUser.setAuthorities(Sets.newHashSet(role.getAuthorities()));
    }
    if (ofNullable(userInput.getAuthorityIds()).isPresent()) {
      Set<Authority> authorities = authorityService.findAllById(userInput.getAuthorityIds());
      currentUser.getAuthorities().addAll(authorities);
    }
    return userRepository.save(currentUser);
  }

  public User updateProfile(String username, UpdateUserProfileInput updateProfileInput) {
    var currentUser = findUserByUsername(username).orElseThrow();
    currentUser.setFirstname(updateProfileInput.getFirstname());
    currentUser.setLastname(updateProfileInput.getLastname());
    currentUser.setProfileImageUrl(updateProfileInput.getProfileImageUrl());
    return userRepository.save(currentUser);
  }

  public User updatePassword(String username, String newPassword) {
    var currentUser = findUserByUsername(username).orElseThrow();
    currentUser.setPassword(passwordEncoder.encode(newPassword));
    return userRepository.save(currentUser);
  }

  public User uploadAvatar(String username, String avatar) {
    var currentUser = findUserByUsername(username).orElseThrow();
    currentUser.setProfileImageUrl(avatar);
    return userRepository.save(currentUser);
  }

  private void validateUsernameAndEmailCreate(String newUsername, String email)
    throws UsernameExistsException, EmailExistsException {
    var userByNewUsername = findUserByUsername(newUsername);
    var userByNewEmail = findUserByEmail(email);
    if (userByNewUsername.isPresent()) {
      throw new UsernameExistsException(UserConstant.USERNAME_ALREADY_EXISTS + newUsername);
    }
    if (userByNewEmail.isPresent()) {
      throw new EmailExistsException(UserConstant.EMAIL_ALREADY_EXISTS + email);
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
