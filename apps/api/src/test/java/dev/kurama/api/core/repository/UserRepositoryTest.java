package dev.kurama.api.core.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = NONE)
@ActiveProfiles(value = "integration-test")
class UserRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private UserRepository userRepository;

  private Role role;

  @BeforeEach
  void setUp() {
    role = entityManager.persist(Role.builder().setRandomUUID().name("role1").build());
  }

  @Test
  void should_find_user_by_username() {
    User user1 = User.builder().setRandomUUID().username("username1").role(role).build();
    entityManager.persist(user1);
    User user2 = User.builder().setRandomUUID().username("username2").role(role).build();
    entityManager.persist(user2);
    entityManager.flush();

    Optional<User> actual = userRepository.findUserByUsername(user2.getUsername());

    assertThat(actual).isPresent().get()
      .hasFieldOrPropertyWithValue("id", user2.getId())
      .hasFieldOrPropertyWithValue("username", user2.getUsername());
  }

  @Test
  void should_find_user_by_email() {
    User user1 = User.builder().setRandomUUID().username("username1").email("username1@email.com").role(role).build();
    entityManager.persist(user1);
    User user2 = User.builder().setRandomUUID().username("username2").email("username2@email.com").role(role).build();
    entityManager.persist(user2);
    entityManager.flush();

    Optional<User> actual = userRepository.findUserByEmail(user2.getEmail());

    assertThat(actual).isPresent().get()
      .hasFieldOrPropertyWithValue("id", user2.getId())
      .hasFieldOrPropertyWithValue("username", user2.getUsername())
      .hasFieldOrPropertyWithValue("email", user2.getEmail());
  }
}
