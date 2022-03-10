package dev.kurama.api.core.service;

import static com.google.common.collect.Sets.newHashSet;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.util.Lists.newArrayList;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.data.domain.Sort.Direction.ASC;

import dev.kurama.api.core.domain.ActivationToken;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.EmailTemplate;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.event.emitter.UserChangedEventEmitter;
import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ActivationTokenUserMismatchException;
import dev.kurama.api.core.exception.domain.SignupClosedException;
import dev.kurama.api.core.exception.domain.exists.UserExistsException;
import dev.kurama.api.core.exception.domain.not.found.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.hateoas.input.SignupInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.repository.UserRepository;
import java.lang.reflect.UndeclaredThrowableException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Spy
  @InjectMocks
  private UserService userService;

  @Mock
  private UserRepository userRepository;

  @Mock
  private BCryptPasswordEncoder passwordEncode;

  @Mock
  private AuthorityService authorityService;

  @Mock
  private ActivationTokenService activationTokenService;

  @Mock
  private EmailService emailService;

  @Mock
  private UserChangedEventEmitter userChangedEventEmitter;

  @Mock
  private RoleService roleService;

  @Mock
  private GlobalSettingsService globalSettingsService;

  @Test
  void should_find_user_by_id() {
    User expected = User.builder().setRandomUUID().build();
    when(userRepository.findById(expected.getId())).thenReturn(Optional.of(expected));

    Optional<User> actual = userService.findUserById(expected.getId());

    verify(userRepository).findById(expected.getId());
    assertThat(actual).isNotNull().isPresent().get().isEqualTo(expected);
  }

  @Test
  void should_find_user_by_username() {
    User expected = User.builder().setRandomUUID().username("username").build();
    when(userRepository.findUserByUsername(expected.getUsername())).thenReturn(Optional.of(expected));

    Optional<User> actual = userService.findUserByUsername(expected.getUsername());

    verify(userRepository).findUserByUsername(expected.getUsername());
    assertThat(actual).isNotNull().isPresent().get().isEqualTo(expected);
  }

  @Test
  void should_find_user_by_email() {
    User expected = User.builder().setRandomUUID().email("email@email.com").build();
    when(userRepository.findUserByEmail(expected.getEmail())).thenReturn(Optional.of(expected));

    Optional<User> actual = userService.findUserByEmail(expected.getEmail());

    verify(userRepository).findUserByEmail(expected.getEmail());
    assertThat(actual).isNotNull().isPresent().get().isEqualTo(expected);
  }

  @Nested
  class GetAllRolesTests {

    @Test
    void should_get_all_users() {
      PageRequest pageable = PageRequest.of(1, 2, Sort.by(ASC, "id"));
      Page<User> expected = new PageImpl<User>(newArrayList(User.builder().setRandomUUID().build()));
      when(userRepository.findAll(pageable)).thenReturn(expected);

      Page<User> actual = userService.getAllUsers(pageable, "");

      verify(userRepository).findAll(pageable);
      verifyNoMoreInteractions(userRepository);
      assertEquals(expected, actual);
    }

    @Test
    void should_get_users_filtered() {
      String search = "search";
      PageRequest pageable = PageRequest.of(1, 2, Sort.by(ASC, "id"));
      Page<User> expected = new PageImpl<User>(newArrayList(User.builder().setRandomUUID().username("search").build()));
      when(userRepository.findAll(any(Example.class), eq(pageable))).thenReturn(expected);

      Page<User> actual = userService.getAllUsers(pageable, search);

      verify(userRepository).findAll(any(Example.class), eq(pageable));
      verifyNoMoreInteractions(userRepository);
      assertEquals(expected, actual);
    }
  }

  @Test
  void should_delete_user_by_id() throws UserNotFoundException {
    User expected = User.builder().setRandomUUID().build();
    when(userRepository.findById(expected.getId())).thenReturn(Optional.of(expected));

    userService.deleteUserById(expected.getId());

    verify(userRepository).delete(expected);
    verify(userChangedEventEmitter).emitUserDeletedEvent(expected.getId());
  }

  @Nested
  class SignupTests {

    @Test
    void should_throw_if_signup_is_locked() {
      when(globalSettingsService.getGlobalSettings()).thenReturn(GlobalSettings.builder().signupOpen(false).build());
      assertThrows(SignupClosedException.class,
        () -> userService.signup(SignupInput.builder().username("").email("").build()));
    }

    @Test
    void should_signup() throws UserExistsException, SignupClosedException, ActivationTokenRecentException {
      User expected = User.builder().setRandomUUID().email("email@email.com").build();
      Role defaultRole = Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build();
      SignupInput input = SignupInput.builder()
        .firstname("firstname")
        .lastname("lastname")
        .email("email@email.com")
        .username("username")
        .build();
      when(globalSettingsService.getGlobalSettings()).thenReturn(
        GlobalSettings.builder().signupOpen(true).defaultRole(defaultRole).build());
      doReturn(expected).when(userService).createUser(any(UserInput.class));
      when(activationTokenService.createActivationToken(expected)).thenReturn(
        ActivationToken.builder().setRandomUUID().created(new Date()).attempts(0).build());

      userService.signup(input);

      verify(globalSettingsService, times(1)).getGlobalSettings();
      verify(userService).createUser(any(UserInput.class));
      verify(userRepository).saveAndFlush(expected);
      verify(emailService).sendEmail(argThat((EmailTemplate template) -> template.getTo().equals(expected.getEmail())));
    }
  }

  @Nested
  class CreateUserTests {

    @Test
    void should_create_user() throws UserExistsException {
      Role role = Role.builder()
        .setRandomUUID()
        .name("ROLE_NAME")
        .authorities(newHashSet(Authority.builder().setRandomUUID().name("Auhtority").build()))
        .build();
      UserInput input = UserInput.builder()
        .username("username")
        .email("email@email.com")
        .firstname("firstname")
        .lastname("lastname")
        .password("passw0rd")
        .credentialsExpired(false)
        .active(true)
        .locked(false)
        .expired(false)
        .roleId(role.getId())
        .build();
      User expected = User.builder().setRandomUUID().build();
      String encodedPassword = randomUUID();

      when(roleService.findRoleById(input.getRoleId())).thenReturn(Optional.of(role));
      when(passwordEncode.encode(input.getPassword())).thenReturn(encodedPassword);
      when(userRepository.save(any(User.class))).thenReturn(expected);

      User actual = userService.createUser(input);

      verifyNoInteractions(globalSettingsService);
      verify(roleService).findRoleById(role.getId());
      verify(passwordEncode).encode(input.getPassword());
      verify(userRepository).save(any(User.class));
      verify(userRepository).save(argThat((User user) -> user.isActive() == input.getActive()
        && user.isLocked() == input.getLocked()
        && user.isExpired() == input.getExpired()
        && user.isCredentialsExpired() == input.getCredentialsExpired()
        && user.getFirstname().equals(input.getFirstname())
        && user.getLastname().equals(input.getLastname())
        && user.getEmail().equals(input.getEmail())
        && user.getUsername().equals(input.getUsername())
        && user.getPassword().equals(encodedPassword)
        && user.getRole().equals(role)
        && user.getAuthorities().equals(role.getAuthorities())));
      verify(userChangedEventEmitter).emitUserCreatedEvent(anyString());
      assertEquals(expected, actual);
    }

    @Test
    void should_create_user_with_default_role() throws UserExistsException {
      Role defaultRole = Role.builder()
        .setRandomUUID()
        .name("ROLE_NAME")
        .authorities(newHashSet(Authority.builder().setRandomUUID().name("Auhtority").build()))
        .build();
      UserInput input = UserInput.builder()
        .username("username")
        .email("email@email.com")
        .firstname("firstname")
        .lastname("lastname")
        .password("passw0rd")
        .credentialsExpired(false)
        .active(true)
        .locked(false)
        .expired(false)
        .roleId(randomUUID())
        .build();
      User expected = User.builder().setRandomUUID().build();
      String encodedPassword = randomUUID();
      when(roleService.findRoleById(anyString())).thenReturn(Optional.empty());
      when(globalSettingsService.getGlobalSettings()).thenReturn(
        GlobalSettings.builder().signupOpen(true).defaultRole(defaultRole).build());
      when(passwordEncode.encode(input.getPassword())).thenReturn(encodedPassword);
      when(userRepository.save(any(User.class))).thenReturn(expected);

      User actual = userService.createUser(input);

      verify(roleService).findRoleById(anyString());
      verify(globalSettingsService).getGlobalSettings();
      verify(passwordEncode).encode(input.getPassword());
      verify(userRepository).save(any(User.class));
      verify(userRepository).save(argThat((User user) -> user.getRole().equals(defaultRole) && user.getAuthorities()
        .equals(defaultRole.getAuthorities())));
      verify(userChangedEventEmitter).emitUserCreatedEvent(anyString());
      assertEquals(expected, actual);
    }
  }

  @Nested
  class UpdateUserTests {

    @Test
    void should_update_user_except_role_and_authority()
      throws UserNotFoundException, RoleNotFoundException, UserExistsException {
      UserInput input = UserInput.builder()
        .username("username-A")
        .password("passw0rd")
        .firstname("firstname-A")
        .lastname("lastname-A")
        .email("email-A@email.com")
        .profileImageUrl("image-url-A")
        .active(false)
        .locked(true)
        .expired(false)
        .credentialsExpired(true)
        .build();
      User expected = User.builder()
        .setRandomUUID()
        .username("username-B")
        .firstname("firstname-B")
        .lastname("lastname-B")
        .email("email-B@email.com")
        .profileImageUrl("image-url-B")
        .active(true)
        .locked(false)
        .expired(true)
        .credentialsExpired(false)
        .build();
      String encodedPassword = randomUUID();
      when(userRepository.findById(expected.getId())).thenReturn(Optional.of(expected));
      when(passwordEncode.encode(input.getPassword())).thenReturn(encodedPassword);
      when(userRepository.save(expected)).thenReturn(expected);

      User actual = userService.updateUser(expected.getId(), input);

      verify(userRepository).findById(expected.getId());
      verify(passwordEncode).encode(input.getPassword());
      verifyNoInteractions(roleService, authorityService);
      verify(userRepository).save(expected);
      verify(userChangedEventEmitter).emitUserUpdatedEvent(expected.getId());
      assertEquals(expected, actual);
      assertEquals(input.getFirstname(), actual.getFirstname());
      assertEquals(input.getEmail(), actual.getEmail());
      assertEquals(input.getLastname(), actual.getLastname());
      assertEquals(input.getUsername(), actual.getUsername());
      assertEquals(encodedPassword, actual.getPassword());
      assertEquals(input.getLocked(), actual.isLocked());
      assertEquals(input.getActive(), actual.isActive());
      assertEquals(input.getExpired(), actual.isExpired());
      assertEquals(input.getCredentialsExpired(), actual.isCredentialsExpired());
    }

    @Test
    void should_update_user_role() throws UserNotFoundException, RoleNotFoundException, UserExistsException {
      Role currentRole = Role.builder().setRandomUUID().name("ROLE_A").build();
      Role targetRole = Role.builder().setRandomUUID().name("ROLE_B").build();
      UserInput input = UserInput.builder().roleId(targetRole.getId()).build();
      User expected = User.builder()
        .setRandomUUID()
        .username("username")
        .email("email@email.com")
        .role(currentRole)
        .build();
      when(userRepository.findById(expected.getId())).thenReturn(Optional.of(expected));
      when(roleService.findRoleById(targetRole.getId())).thenReturn(Optional.of(targetRole));
      when(userRepository.save(expected)).thenReturn(expected);

      User actual = userService.updateUser(expected.getId(), input);

      verifyNoInteractions(passwordEncode, authorityService);
      verify(userRepository).findById(expected.getId());
      verify(roleService).findRoleById(targetRole.getId());
      verify(userRepository).save(expected);
      verify(userChangedEventEmitter).emitUserUpdatedEvent(expected.getId());
      assertEquals(targetRole, actual.getRole());
      assertEquals(targetRole.getAuthorities(), actual.getAuthorities());
    }

    @Test
    void should_update_user_authorities() throws UserNotFoundException, RoleNotFoundException, UserExistsException {
      Authority authority1 = Authority.builder().setRandomUUID().name("authority1").build();
      Authority authority2 = Authority.builder().setRandomUUID().name("authority2").build();
      Authority authority3 = Authority.builder().setRandomUUID().name("authority3").build();
      UserInput input = UserInput.builder().authorityIds(newHashSet(authority2.getId(), authority3.getId())).build();
      User expected = User.builder()
        .setRandomUUID()
        .username("username")
        .email("email@email.com")
        .authorities(newHashSet(authority1))
        .build();

      when(userRepository.findById(expected.getId())).thenReturn(Optional.of(expected));
      when(userRepository.save(expected)).thenReturn(expected);
      HashSet<Authority> authorities = newHashSet(authority2, authority3);
      when(authorityService.findAllById(input.getAuthorityIds())).thenReturn(authorities);

      User actual = userService.updateUser(expected.getId(), input);

      verifyNoInteractions(passwordEncode, roleService);
      verify(userRepository).findById(expected.getId());
      verify(userRepository).save(expected);
      verify(userChangedEventEmitter).emitUserUpdatedEvent(expected.getId());
      assertEquals(authorities, actual.getAuthorities());
    }

    @Test
    void should_not_update_user_if_nothing_has_changed()
      throws UserNotFoundException, RoleNotFoundException, UserExistsException {
      Authority authority1 = Authority.builder().setRandomUUID().name("authority1").build();
      Authority authority2 = Authority.builder().setRandomUUID().name("authority2").build();
      Role role = Role.builder().setRandomUUID().name("ROLE_A").authorities(newHashSet(authority1, authority2)).build();
      UserInput input = UserInput.builder()
        .username("username")
        .firstname("firstname")
        .lastname("lastname")
        .email("email@email.com")
        .profileImageUrl("image-url")
        .active(true)
        .locked(false)
        .expired(true)
        .credentialsExpired(false)
        .roleId(role.getId())
        .authorityIds(newHashSet(authority1.getId(), authority2.getId()))
        .build();
      User expected = User.builder()
        .setRandomUUID()
        .username("username")
        .firstname("firstname")
        .lastname("lastname")
        .email("email@email.com")
        .profileImageUrl("image-url")
        .role(role)
        .authorities(role.getAuthorities())
        .active(true)
        .locked(false)
        .expired(true)
        .credentialsExpired(false)
        .build();
      when(userRepository.findById(expected.getId())).thenReturn(Optional.of(expected));

      User actual = userService.updateUser(expected.getId(), input);

      verifyNoInteractions(userChangedEventEmitter, roleService, authorityService, passwordEncode);
      verify(userRepository, never()).save(any());

      assertEquals(expected, actual);
    }
  }

  @Test
  void request_activation_token_by_id() throws ActivationTokenRecentException, UserNotFoundException {
    User expected = User.builder().setRandomUUID().build();
    when(userRepository.findById(expected.getId())).thenReturn(Optional.of(expected));
    doNothing().when(userService).requestActivationToken(expected);

    userService.requestActivationTokenById(expected.getId());

    verify(userRepository).findById(expected.getId());
    verify(userService).requestActivationToken(expected);
  }

  @Test
  void request_activation_token_by_email() throws ActivationTokenRecentException, UserNotFoundException {
    User expected = User.builder().setRandomUUID().email("email@example.com").build();
    when(userRepository.findUserByEmail(expected.getEmail())).thenReturn(Optional.of(expected));
    doNothing().when(userService).requestActivationToken(expected);

    userService.requestActivationTokenByEmail(expected.getEmail());

    verify(userRepository).findUserByEmail(expected.getEmail());
    verify(userService).requestActivationToken(expected);
  }

  @Test
  void activate_account()
    throws ActivationTokenExpiredException, ActivationTokenNotFoundException, ActivationTokenUserMismatchException,
    UserNotFoundException {
    AccountActivationInput input = AccountActivationInput.builder()
      .token(randomUUID())
      .password("passw0rd")
      .email("email@example.com")
      .build();
    User expected = User.builder().setRandomUUID().email("email@example.com").build();
    ActivationToken token = ActivationToken.builder().setRandomUUID().created(new Date()).attempts(0).build();
    when(userRepository.findUserByEmail(input.getEmail())).thenReturn(Optional.of(expected));
    when(activationTokenService.findActivationToken(input.getToken())).thenReturn(token);

    userService.activateAccount(input);

    verify(userRepository).findUserByEmail(expected.getEmail());
    verify(activationTokenService).findActivationToken(input.getToken());
    verify(activationTokenService).verifyActivationTokenMatch(token, expected);
    verify(passwordEncode).encode(input.getPassword());
    verify(userRepository).saveAndFlush(expected);
    verify(emailService).sendEmail(any(EmailTemplate.class));
  }

  @Test
  void request_activation_token() throws ActivationTokenRecentException {
    User expected = User.builder().setRandomUUID().build();
    when(activationTokenService.createActivationToken(expected)).thenReturn(
      ActivationToken.builder().setRandomUUID().created(new Date()).attempts(0).build());

    userService.requestActivationToken(expected);

    verify(userRepository).saveAndFlush(expected);
    verify(emailService).sendEmail(any(EmailTemplate.class));
  }

  @Test
  void reassign_to_role() {
    Authority authority1 = Authority.builder().setRandomUUID().name("authority1").build();
    Authority authority2 = Authority.builder().setRandomUUID().name("authority2").build();
    Role currentRole = Role.builder().setRandomUUID().authorities(newHashSet(authority1)).name("ROLE_A").build();
    Role targetRole = Role.builder().setRandomUUID().authorities(newHashSet(authority2)).name("ROLE_B").build();
    User user1 = User.builder().setRandomUUID().username("user1").role(currentRole).build();
    User user2 = User.builder().setRandomUUID().username("user2").role(currentRole).build();
    ArrayList<User> users = newArrayList(user1, user2);
    when(userRepository.saveAllAndFlush(users)).thenReturn(users);

    userService.reassignToRole(users, targetRole);

    verify(userRepository).saveAllAndFlush(users);
    verify(userChangedEventEmitter).emitUserUpdatedEvent(user1.getId());
    verify(userChangedEventEmitter).emitUserUpdatedEvent(user2.getId());
    verifyNoMoreInteractions(userChangedEventEmitter);
    assertThat(users.get(0).getRole()).isEqualTo(targetRole);
    assertThat(users.get(0).getAuthorities()).isEqualTo(targetRole.getAuthorities());
  }

  @Test
  void should_throw_if_username_exists() {
    String username = "username";
    String email = "email";
    when(userRepository.findUserByUsername(username)).thenReturn(Optional.of(User.builder().setRandomUUID().build()));

    assertThrows(UndeclaredThrowableException.class,
      () -> ReflectionTestUtils.invokeMethod(userService, "validateNewUsernameAndEmail", username, email));
  }

  @Test
  void should_throw_if_email_exists() {
    String username = "username";
    String email = "email";
    when(userRepository.findUserByEmail(email)).thenReturn(Optional.of(User.builder().setRandomUUID().build()));

    assertThrows(UndeclaredThrowableException.class,
      () -> ReflectionTestUtils.invokeMethod(userService, "validateNewUsernameAndEmail", username, email));
  }
}
