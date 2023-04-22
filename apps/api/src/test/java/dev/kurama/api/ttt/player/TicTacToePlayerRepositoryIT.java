package dev.kurama.api.ttt.player;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = NONE)
@ActiveProfiles(value = "integration-test")
class TicTacToePlayerRepositoryIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private TicTacToePlayerRepository repository;

  TicTacToePlayer playerX;
  TicTacToePlayer playerO;
  TicTacToePlayer playerR;

  @BeforeEach
  void setUp() {
    Role role = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
    User userX = entityManager.persist(User.builder().setRandomUUID().username("user-x").role(role).build());
    playerX = entityManager.persist(
      TicTacToePlayer.builder().setRandomUUID().user(userX).username(userX.getUsername()).build());
    User userO = entityManager.persist(User.builder().setRandomUUID().username("user-o").role(role).build());
    playerO = entityManager.persist(
      TicTacToePlayer.builder().setRandomUUID().user(userO).username(userO.getUsername()).build());
    User userR = entityManager.persist(User.builder().setRandomUUID().username("user-r").role(role).build());
    playerR = entityManager.persist(
      TicTacToePlayer.builder().setRandomUUID().user(userR).username(userR.getUsername()).build());
  }


  @Nested
  class FindAllByUsernameLikeTests {

    @Test
    void should_find_all_players_by_username_like() {
      List<TicTacToePlayer> actual = repository.findAllByUserUsernameLike("%ser%");

      assertThat(actual).asList()
        .isNotEmpty()
        .hasSize(3)
        .extracting("id")
        .contains(playerX.getId(), playerO.getId(), playerR.getId());
    }

    @Test
    void should_find_one_players_by_username_like() {
      List<TicTacToePlayer> actual = repository.findAllByUserUsernameLike("%er-x%");

      assertThat(actual).asList().isNotEmpty().hasSize(1).extracting("id").contains(playerX.getId());
    }

    @Test
    void should_find_no_players_by_username_like() {
      List<TicTacToePlayer> actual = repository.findAllByUserUsernameLike("%er-z%");

      assertThat(actual).asList().isEmpty();
    }
  }

}
