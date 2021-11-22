package dev.kurama.api.core.service;

import static dev.kurama.api.core.constant.ActivationTokenConstant.ACTIVATION_EMAIL_SUBJECT;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.util.Optional.ofNullable;
import static org.apache.logging.log4j.util.Strings.isEmpty;

import com.google.common.collect.Sets;
import dev.kurama.api.core.constant.UserConstant;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.EmailTemplate;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPreferences;
import dev.kurama.api.core.domain.UserPrincipal;
import dev.kurama.api.core.event.emitter.UserChangedEventEmitter;
import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ActivationTokenUserMismatchException;
import dev.kurama.api.core.exception.domain.SignupClosedException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.EmailNotFoundException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.hateoas.input.SignupInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.repository.UserRepository;
import java.util.Collection;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.ExampleMatcher.GenericPropertyMatchers;
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
  private final AuthorityService authorityService;

  @NonNull
  private final ActivationTokenService activationTokenService;

  @NonNull
  private final EmailService emailService;

  @NonNull
  private final UserChangedEventEmitter userChangedEventEmitter;

  private RoleService roleService;

  @Autowired
  public void setRoleService(@NonNull RoleService roleService) {
    this.roleService = roleService;
  }

  private GlobalSettingsService globalSettingsService;

  @Autowired
  public void setGlobalSettingsService(@NonNull GlobalSettingsService globalSettingsService) {
    this.globalSettingsService = globalSettingsService;
  }

  @Value("${application.host_url}")
  private String host;

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
    return userRepository.findById(id);
  }

  public Optional<User> findUserByUsername(String username) {
    return userRepository.findUserByUsername(username);
  }

  public Optional<User> findUserByEmail(String email) {
    return userRepository.findUserByEmail(email);
  }

  public Page<User> getAllUsers(Pageable pageable, String search) {
    if (isEmpty(search)) {
      return userRepository.findAll(pageable);
    } else {
      return userRepository.findAll(getUserExample(search), pageable);
    }
  }

  public void deleteUserById(String id) throws UserNotFoundException {
    User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    userRepository.delete(user);
    userChangedEventEmitter.emitUserDeletedEvent(user.getId());
  }

  public void signup(SignupInput signupInput)
    throws UsernameExistsException, EmailExistsException, SignupClosedException {
    GlobalSettings globalSettings = globalSettingsService.getGlobalSettings();
    if (!globalSettings.isSignupOpen()) {
      throw new SignupClosedException();
    }

    var userInput = UserInput.builder()
      .username(signupInput.getUsername())
      .password(randomUUID())
      .email(signupInput.getEmail())
      .firstname(signupInput.getFirstname())
      .lastname(signupInput.getLastname())
      .active(true)
      .locked(true)
      .expired(false)
      .credentialsExpired(false)
      .roleId(globalSettings.getDefaultRole().getId())
      .build();
    var user = createUser(userInput);

    try {
      user.setActivationToken(activationTokenService.createActivationToken(user));
      userRepository.saveAndFlush(user);
      sendActivationTokenEmail(user, user.getActivationToken().getId());
    } catch (ActivationTokenRecentException ignored) {
      log.atFine().log("This should not be seen... user:" + user.getId());
    }
  }

  public User createUser(UserInput userInput)
    throws UsernameExistsException, EmailExistsException {
    validateNewUsernameAndEmail(userInput.getUsername(), userInput.getEmail());
    var role = roleService.findRoleById(userInput.getRoleId())
      .orElseGet(() -> globalSettingsService.getGlobalSettings().getDefaultRole());
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
      .userPreferences(UserPreferences.builder().setRandomUUID().build())
      .build();
    user = userRepository.save(user);
    userChangedEventEmitter.emitUserCreatedEvent(user.getId());

    return user;
  }

  public User updateUser(String id, UserInput userInput)
    throws EmailExistsException, UsernameExistsException, UserNotFoundException, RoleNotFoundException {
    var user = findUserById(id).orElseThrow(() -> new UserNotFoundException(UserConstant.NO_USER_FOUND_BY_ID + id));
    var changed = false;
    if (ofNullable(userInput.getEmail()).isPresent() && !user.getEmail()
      .equalsIgnoreCase(userInput.getEmail())) {
      if (findUserByEmail(userInput.getEmail()).isPresent()) {
        throw new EmailExistsException(UserConstant.EMAIL_ALREADY_EXISTS + userInput.getEmail());
      }
      user.setEmail(userInput.getEmail());
      changed = true;
    }
    if (ofNullable(userInput.getUsername()).isPresent() && !user.getUsername()
      .equalsIgnoreCase(userInput.getUsername())) {
      if (findUserByUsername(userInput.getUsername()).isPresent()) {
        throw new UsernameExistsException(UserConstant.USERNAME_ALREADY_EXISTS + userInput.getUsername());
      }
      user.setUsername(userInput.getUsername());
      changed = true;
    }
    if (ofNullable(userInput.getPassword()).isPresent()) {
      user.setPassword(passwordEncoder.encode(userInput.getPassword()));
      changed = true;
    }
    if (ofNullable(userInput.getFirstname()).isPresent() && !userInput.getFirstname()
      .equals(user.getFirstname())) {
      user.setFirstname(userInput.getFirstname());
      changed = true;
    }
    if (ofNullable(userInput.getLastname()).isPresent() && !userInput.getLastname().equals(user.getLastname())) {
      user.setLastname(userInput.getLastname());
      changed = true;
    }
    if (ofNullable(userInput.getProfileImageUrl()).isPresent() && !userInput.getProfileImageUrl()
      .equals(user.getProfileImageUrl())) {
      user.setProfileImageUrl(userInput.getProfileImageUrl());
      changed = true;
    }
    if (ofNullable(userInput.getActive()).isPresent() && !userInput.getActive().equals(user.isActive())) {
      user.setActive(userInput.getActive());
      changed = true;
    }
    if (ofNullable(userInput.getLocked()).isPresent() && !userInput.getLocked().equals(user.isLocked())) {
      user.setLocked(userInput.getLocked());
      changed = true;
    }
    if (ofNullable(userInput.getExpired()).isPresent() && !userInput.getExpired().equals(user.isExpired())) {
      user.setExpired(userInput.getExpired());
      changed = true;
    }
    if (ofNullable(userInput.getCredentialsExpired()).isPresent() && !userInput.getCredentialsExpired()
      .equals(user.isCredentialsExpired())) {
      user.setCredentialsExpired(userInput.getCredentialsExpired());
      changed = true;
    }
    if (ofNullable(userInput.getRoleId()).isPresent() && !userInput.getRoleId().equals(user.getRole().getId())) {
      var role = roleService.findRoleById(userInput.getRoleId())
        .orElseThrow(() -> new RoleNotFoundException(userInput.getRoleId()));
      setRoleAndAuthorities(user, role);
      changed = true;
    }
    if (ofNullable(userInput.getAuthorityIds()).isPresent() && (
      userInput.getAuthorityIds().size() != user.getAuthorities().size()
        || !userInput.getAuthorityIds().containsAll(
        user.getAuthorities().stream().map(Authority::getId).collect(Collectors.toSet())))) {
      user.setAuthorities(authorityService.findAllById(userInput.getAuthorityIds()));
      changed = true;
    }
    if (changed) {
      user = userRepository.save(user);
      userChangedEventEmitter.emitUserUpdatedEvent(user.getId());
    }
    return user;
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

  @Transactional
  public void requestActivationToken(User user) throws ActivationTokenRecentException {

    user.setActivationToken(activationTokenService.createActivationToken(user));
    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
    user.setLocked(true);
    userRepository.saveAndFlush(user);

    sendActivationTokenEmail(user, user.getActivationToken().getId());
  }

  public void reassignToRole(Collection<User> users, Role role) {
    users.forEach(user -> setRoleAndAuthorities(user, role));
    users = this.userRepository.saveAllAndFlush(users);
    users.forEach(user -> this.userChangedEventEmitter.emitUserUpdatedEvent(user.getId()));
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
    String activationEmailText = String.format(
      "Here is the token to activate your account:<br><br>%s<br><br>"
        + "It is valid for 24 hours, you can follow this link to reset your password:<br><br>"
        + "<a href =\"%s/auth/activation?token=%s&email=%s\"> Click Here </a><br><br><br>"
        + "Thank You", token, host, token, user.getEmail());

    emailService.sendEmail(
      EmailTemplate.builder()
        .to(user.getEmail())
        .subject(ACTIVATION_EMAIL_SUBJECT)
        .text(activationEmailText)
        .build());
  }

  private void setRoleAndAuthorities(User user, Role role) {
    user.setRole(role);
    user.setAuthorities(Sets.newHashSet(role.getAuthorities()));
  }

  private Example<User> getUserExample(String search) {
    return Example.of(
      User.builder().username(search).email(search).firstname(search).lastname(search).build(),
      ExampleMatcher.matchingAny()
        .withIgnorePaths("active", "locked", "expired", "credentialsExpired")
        .withMatcher("username", GenericPropertyMatchers.contains().ignoreCase())
        .withMatcher("email", GenericPropertyMatchers.contains().ignoreCase())
        .withMatcher("firstname", GenericPropertyMatchers.contains().ignoreCase())
        .withMatcher("lastname", GenericPropertyMatchers.contains().ignoreCase()));
  }
}
