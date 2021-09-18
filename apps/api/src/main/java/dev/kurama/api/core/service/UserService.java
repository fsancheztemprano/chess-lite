package dev.kurama.api.core.service;

import static dev.kurama.api.core.constant.ActivationTokenConstant.ACTIVATION_EMAIL_SUBJECT;
import static dev.kurama.api.core.constant.ActivationTokenConstant.getActivationEmailText;
import static java.util.Optional.ofNullable;

import com.google.common.collect.Sets;
import dev.kurama.api.core.constant.UserConstant;
import dev.kurama.api.core.domain.ActivationToken;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.EmailTemplate;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ActivationTokenUserMismatchException;
import dev.kurama.api.core.exception.domain.EmailExistsException;
import dev.kurama.api.core.exception.domain.EmailNotFoundException;
import dev.kurama.api.core.exception.domain.RoleNotFoundException;
import dev.kurama.api.core.exception.domain.UserNotFoundException;
import dev.kurama.api.core.exception.domain.UsernameExistsException;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.hateoas.input.SignupInput;
import dev.kurama.api.core.hateoas.input.UpdateUserProfileInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.repository.UserRepository;
import java.util.Date;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
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

  @NonNull
  private final ActivationTokenService activationTokenService;

  @NonNull
  private final EmailService emailService;

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
    var user = findUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    userRepository.delete(user);
  }

  public void deleteUserById(String id) throws UserNotFoundException {
    var user = userRepository.findUserById(id).orElseThrow(() -> new UserNotFoundException(id));
    userRepository.deleteById(user.getTid());
  }

  public void signup(SignupInput signupInput)
    throws UsernameExistsException, EmailExistsException {
    validateNewUsernameAndEmail(signupInput.getUsername(), signupInput.getEmail());
    var role = roleService.getDefaultRole().orElseThrow();
    User user = User.builder()
      .setRandomUUID()
      .username(signupInput.getUsername())
      .password(passwordEncoder.encode(UUID.randomUUID().toString()))
      .email(signupInput.getEmail())
      .firstname(signupInput.getFirstname())
      .lastname(signupInput.getLastname())
      .joinDate(new Date())
      .active(true)
      .locked(true)
      .expired(false)
      .credentialsExpired(false)
      .role(role)
      .authorities(Sets.newHashSet(role.getAuthorities()))
      .build();
    user = userRepository.save(user);

    userPreferencesService.createUserPreferences(user);

    try {
      ActivationToken newToken = activationTokenService.createActivationToken(user);
      sendActivationTokenEmail(user, newToken.getId());
    } catch (ActivationTokenRecentException ignored) {
    }
  }

  public User createUser(UserInput userInput)
    throws UsernameExistsException, EmailExistsException {
    validateNewUsernameAndEmail(userInput.getUsername(), userInput.getEmail());
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
    var currentUser = findUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
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

  public void requestActivationTokenById(String id) throws UserNotFoundException, ActivationTokenRecentException {
    var user = findUserById(id).orElseThrow(() -> new UserNotFoundException(id));
    requestActivationToken(user);
  }

  public void requestActivationTokenByEmail(String email)
    throws EmailNotFoundException, ActivationTokenRecentException {
    var user = findUserByEmail(email).orElseThrow(() -> new EmailNotFoundException(email));
    requestActivationToken(user);
  }

  public void activateAccount(AccountActivationInput accountActivationInput)
    throws ActivationTokenExpiredException, ActivationTokenNotFoundException, EmailNotFoundException, ActivationTokenUserMismatchException {
    var activationToken = activationTokenService.findActivationToken(accountActivationInput.getToken());

    var user = findUserByEmail(accountActivationInput.getEmail())
      .orElseThrow(() -> new EmailNotFoundException(accountActivationInput.getEmail()));

    activationTokenService.verifyActivationTokenMatch(activationToken, user);

    user.setLocked(false);
    user.setPassword(passwordEncoder.encode(accountActivationInput.getPassword()));
    user.setActivationToken(null);
    userRepository.saveAndFlush(user);

    emailService.sendEmail(
      EmailTemplate.builder()
        .to(user.getEmail())
        .subject(ACTIVATION_EMAIL_SUBJECT)
        .text("Your Account has just been Activated.")
        .build());
  }

  private void requestActivationToken(User user) throws ActivationTokenRecentException {
    var newToken = activationTokenService.createActivationToken(user);

    user.setLocked(true);
    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
    userRepository.saveAndFlush(user);

    sendActivationTokenEmail(user, newToken.getId());
  }

  private void validateNewUsernameAndEmail(String newUsername, String email)
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

  private void sendActivationTokenEmail(User user, String token) {
    emailService.sendEmail(
      EmailTemplate.builder()
        .to(user.getEmail())
        .subject(ACTIVATION_EMAIL_SUBJECT)
        .text(getActivationEmailText(token, user.getEmail()))
        .build());
  }
}
