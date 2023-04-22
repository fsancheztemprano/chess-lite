package dev.kurama.api.ttt.player;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

@ServiceLayerIntegrationTestConfig
@Import({TicTacToePlayerService.class})
class TicTacToePlayerServiceIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private TicTacToePlayerService service;

  TicTacToePlayer player1;
  TicTacToePlayer player2;
  TicTacToePlayer player3;


  @BeforeEach
  void setUp() {
    Role role = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
    var user1 = entityManager.persist(User.builder().setRandomUUID().role(role).username("John Doe").build());
    player1 = entityManager.persist(TicTacToePlayer.builder()
      .id(user1.getId())
      .username(user1.getUsername())
      .user(user1)
      .wins(0)
      .draws(0)
      .losses(0)
      .build());
    var user2 = entityManager.persist(User.builder().setRandomUUID().role(role).username("Jane Doe").build());
    player2 = entityManager.persist(TicTacToePlayer.builder()
      .id(user2.getId())
      .username(user2.getUsername())
      .user(user2)
      .wins(0)
      .draws(0)
      .losses(0)
      .build());
    var user3 = entityManager.persist(User.builder().setRandomUUID().role(role).username("John Smith").build());
    player3 = entityManager.persist(TicTacToePlayer.builder()
      .id(user3.getId())
      .username(user3.getUsername())
      .user(user3)
      .wins(0)
      .draws(0)
      .losses(0)
      .build());
  }

  @Test
  void should_find_players_with_username_like() {
    List<TicTacToePlayer> actual = service.findPlayers("Doe");

    assertEquals(2, actual.size());
    assertTrue(actual.contains(player1));
    assertTrue(actual.contains(player2));
    assertFalse(actual.contains(player3));
  }

}
