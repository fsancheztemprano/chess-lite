package dev.kurama.api.core.service;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;

import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
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
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@ServiceLayerIntegrationTestConfig
@Import({UserService.class, AuthorityService.class, ActivationTokenService.class, RoleService.class,
  GlobalSettingsService.class})
class UserServiceIT {

  @Autowired
  private TestEntityManager entityManager;

  @MockBean
  private EmailService emailService;

  @Autowired
  private UserService service;

  private User user1;
  private User user2;
  private User user3;
  private User user4;
  private Role defaultRole;

  @BeforeEach
  void setUp() {
    defaultRole = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
    entityManager.persist(
      GlobalSettings.builder().id(GlobalSettings.UNIQUE_ID).signupOpen(true).defaultRole(defaultRole).build());

    user1 = entityManager.persist(User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .role(defaultRole)
      .build());
    user2 = entityManager.persist(User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .role(defaultRole)
      .build());
    user3 = entityManager.persist(User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .role(defaultRole)
      .build());
    user4 = entityManager.persist(User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .role(defaultRole)
      .build());
  }

  @Test
  void should_find_user_by_id() {
    Optional<User> actual = service.findUserById(user1.getId());

    assertThat(actual).isPresent().hasValue(user1);
  }

  @Test
  void should_find_user_by_username() {
    Optional<User> actual = service.findUserByUsername(user2.getUsername());

    assertThat(actual).isPresent().hasValue(user2);
  }

  @Test
  void should_find_user_by_email() {
    Optional<User> actual = service.findUserByEmail(user3.getEmail());

    assertThat(actual).isPresent().hasValue(user3);
  }

  @Test
  void should_get_all_users() {
    Page<User> actual = service.getAllUsers(PageRequest.ofSize(20), null);

    assertThat(actual.getContent()).isNotNull().hasSize(4).containsExactlyInAnyOrder(user1, user2, user3, user4);
  }

  @Test
  void should_delete_user_by_id() throws UserNotFoundException {
    service.deleteUserById(user4.getId());

    assertNull(entityManager.find(User.class, user4.getId()));
  }

  @Test
  void should_signup() throws UserExistsException, SignupClosedException {
    SignupInput input = SignupInput.builder()
      .username(randomAlphanumeric(8))
      .firstname(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .lastname(randomAlphanumeric(8))
      .build();

    service.signup(input);

    assertThat(service.findUserByEmail(input.getEmail())).isPresent();
  }

  @Test
  void should_create_user() throws UserExistsException {
    Role role = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
    UserInput input = UserInput.builder()
      .username(randomAlphanumeric(8))
      .firstname(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .lastname(randomAlphanumeric(8))
      .password(randomAlphanumeric(8))
      .profileImageUrl(randomAlphanumeric(8))
      .active(true)
      .expired(false)
      .locked(false)
      .credentialsExpired(false)
      .roleId(role.getId())
      .build();

    User actual = service.createUser(input);

    assertThat(actual).isNotNull();
    assertThat(actual.getRole().getId()).isEqualTo(role.getId());
  }

  @Test
  void should_update_user() throws UserNotFoundException, RoleNotFoundException, UserExistsException {
    Role role = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
    UserInput input = UserInput.builder()
      .username(randomAlphanumeric(8))
      .firstname(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .lastname(randomAlphanumeric(8))
      .password(randomAlphanumeric(8))
      .roleId(role.getId())
      .build();

    User actual = service.updateUser(user1.getId(), input);

    assertThat(actual).isNotNull();
    assertThat(actual.getRole().getId()).isEqualTo(role.getId());
  }

  @Test
  void should_request_activation_token_by_id() throws UserNotFoundException, ActivationTokenRecentException {
    service.requestActivationTokenById(user2.getId());

    User actual = entityManager.find(User.class, user2.getId());

    assertThat(actual).isNotNull();
    assertThat(actual.getActivationToken()).isNotNull();
  }

  @Test
  void should_request_activation_token_by_email() throws ActivationTokenRecentException, UserNotFoundException {
    service.requestActivationTokenByEmail(user3.getEmail());

    User actual = entityManager.find(User.class, user3.getId());

    assertThat(actual).isNotNull();
    assertThat(actual.getActivationToken()).isNotNull();
  }

  @Test
  void should_activate_account()
    throws ActivationTokenRecentException, ActivationTokenExpiredException, ActivationTokenNotFoundException,
    ActivationTokenUserMismatchException, UserNotFoundException {
    User lockedUser = entityManager.persist(User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .role(defaultRole)
      .locked(true)
      .build());
    service.requestActivationToken(lockedUser);
    AccountActivationInput input = AccountActivationInput.builder().email(lockedUser.getEmail())
      .password(randomAlphanumeric(8))
      .token(lockedUser.getActivationToken().getId())
      .build();

    service.activateAccount(input);

    User actual = entityManager.find(User.class, lockedUser.getId());

    assertThat(actual).isNotNull();
    assertThat(actual.isLocked()).isFalse();
    assertThat(actual.getActivationToken()).isNull();
  }
}
