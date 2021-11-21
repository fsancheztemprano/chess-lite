package dev.kurama.api.core.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.util.Lists.newArrayList;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.data.domain.Sort.Direction.ASC;

import dev.kurama.api.core.domain.ActivationToken;
import dev.kurama.api.core.domain.EmailTemplate;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.event.emitter.UserChangedEventEmitter;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.SignupClosedException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.hateoas.input.SignupInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.repository.UserRepository;
import java.util.Date;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(SpringExtension.class)
class UserServiceTest {

  @Spy
  @InjectMocks
  private UserService userService;

  @Mock
  private UserRepository userRepository;

  @Mock
  private BCryptPasswordEncoder passwordEncode;

  @Mock
  private LoginAttemptService loginAttemptService;

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

  @BeforeEach
  void setUp() {
    userService.setRoleService(roleService);
    userService.setGlobalSettingsService(globalSettingsService);
  }

  @Nested
  class LoadUserByUsernameTests {

    @Test
    void should_load_user_by_username() {
      User expected = User.builder().setRandomUUID().username("username").locked(false).build();
      when(userRepository.findUserByUsername(expected.getUsername())).thenReturn(Optional.of(expected));
      when(loginAttemptService.hasExceededMaxAttempts(expected.getUsername())).thenReturn(false);

      UserDetails actual = userService.loadUserByUsername(expected.getUsername());

      verify(loginAttemptService).hasExceededMaxAttempts(expected.getUsername());
      verify(userRepository).save(expected);
      assertThat(actual).isNotNull();
      User actualUser = (User) ReflectionTestUtils.getField(actual, "user");
      assertThat(actualUser).isNotNull()
        .hasFieldOrPropertyWithValue("id", expected.getId())
        .hasFieldOrPropertyWithValue("locked", false);
    }

    @Test
    void should_evict_if_user_was_locked() {
      User expected = User.builder().setRandomUUID().username("username").locked(true).build();
      when(userRepository.findUserByUsername(expected.getUsername())).thenReturn(Optional.of(expected));

      userService.loadUserByUsername(expected.getUsername());

      verify(loginAttemptService).evictUserFromLoginAttemptCache(expected.getUsername());
    }
  }

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
    void should_signup()
      throws UsernameExistsException, EmailExistsException, SignupClosedException, ActivationTokenRecentException {
      User expected = User.builder().setRandomUUID().email("email@email.com").build();
      Role defaultRole = Role.builder().setRandomUUID().name("DEFAULT_ROLE").build();
      SignupInput input = SignupInput.builder().firstname("firstname").lastname("lastname").email("email@email.com")
        .username("username").build();
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


  @Test
  void createUser() {
  }

  @Test
  void updateUser() {
  }

  @Test
  void requestActivationTokenById() {
  }

  @Test
  void requestActivationTokenByEmail() {
  }

  @Test
  void activateAccount() {
  }

  @Test
  void requestActivationToken() {
  }

  @Test
  void reassignToRole() {
  }
}
