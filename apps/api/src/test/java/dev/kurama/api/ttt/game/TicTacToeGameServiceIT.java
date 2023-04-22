package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.utility.AuthorityUtils.setContextUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.filter.ContextUser;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.input.TicTacToeGameFilterInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameStatusInput;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Pageable;

@ServiceLayerIntegrationTestConfig
@Import({TicTacToeGameService.class})
class TicTacToeGameServiceIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private TicTacToeGameService service;

  TicTacToePlayer playerX;
  TicTacToePlayer playerO;

  TicTacToeGame expected;

  @BeforeEach
  void setUp() {
    Role role = entityManager.persist(Role.builder().setRandomUUID().name("ROLE_USER").build());
    User userX = entityManager.persist(User.builder().setRandomUUID().role(role).username("user-1").build());
    playerX = entityManager.persist(TicTacToePlayer.builder()
      .setRandomUUID()
      .username(userX.getUsername())
      .user(userX)
      .wins(0)
      .draws(0)
      .losses(0)
      .build());
    User userO = entityManager.persist(User.builder().setRandomUUID().role(role).username("user-2").build());
    playerO = entityManager.persist(TicTacToePlayer.builder()
      .setRandomUUID()
      .username(userO.getUsername())
      .user(userO)
      .wins(0)
      .draws(0)
      .losses(0)
      .build());
    expected = entityManager.persist(TicTacToeGame.builder()
      .setRandomUUID()
      .playerX(playerX)
      .playerO(playerO)
      .status(Status.PENDING)
      .lastActivityAt(LocalDateTime.now())
      .requestedAt(LocalDateTime.now())
      .turn(Token.X)
      .build());
  }

  @Test
  void should_find_game_by_id() {
    var actual = service.findById(expected.getId());

    assertNotNull(actual);
    assertThat(actual).isEqualTo(expected);
  }

  @Test
  void should_update_game_status() {
    TicTacToeGameStatusInput input = TicTacToeGameStatusInput.builder().status(Status.IN_PROGRESS.name()).build();
    setContextUser(ContextUser.builder().id(playerO.getId()).username(playerO.getUsername()).build());

    var actual = service.updateStatus(expected.getId(), input);

    assertNotNull(actual);
    assertThat(actual).isEqualTo(expected);
    assertThat(actual.getStatus()).isEqualTo(Status.IN_PROGRESS);
  }

  @Test
  void should_get_all_games() {
    TicTacToeGameFilterInput input = TicTacToeGameFilterInput.builder()
      .myGames(true)
      .player(playerO.getUsername())
      .isPrivate(false)
      .status(List.of(Status.PENDING.name()))
      .build();
    Pageable pageable = Pageable.ofSize(20);
    setContextUser(ContextUser.builder().id(playerO.getId()).username(playerO.getUsername()).build());

    var actual = service.getAll(pageable, input);

    assertThat(actual).isNotEmpty();
    assertThat(actual.getTotalElements()).isEqualTo(1);
    assertThat(actual.toList()).contains(expected);
  }


}
