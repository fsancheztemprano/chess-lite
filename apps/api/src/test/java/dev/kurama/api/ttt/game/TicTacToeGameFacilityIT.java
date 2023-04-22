package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.utility.AuthorityUtils.setContextUser;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.filter.ContextUser;
import dev.kurama.api.ttt.game.input.TicTacToeGameInput;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayerService;
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

@ServiceLayerIntegrationTestConfig
@Import({TicTacToeGameFacility.class, TicTacToeGameService.class, TicTacToePlayerService.class,})
class TicTacToeGameFacilityIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private TicTacToeGameFacility facility;

  @Test
  void should_create_a_ttt_game() {
    Role role = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
    User userX = entityManager.persistAndFlush(User.builder().setRandomUUID().username("playerX").role(role).build());
    TicTacToePlayer playerX = entityManager.persistAndFlush(
      TicTacToePlayer.builder().setRandomUUID().username(userX.getUsername()).user(userX).build());

    User userO = entityManager.persistAndFlush(User.builder().setRandomUUID().username("playerO").role(role).build());
    TicTacToePlayer playerO = entityManager.persistAndFlush(
      TicTacToePlayer.builder().setRandomUUID().username(userO.getUsername()).user(userO).build());
    setContextUser(ContextUser.builder().id(playerX.getId()).username(playerX.getUsername()).build());

    TicTacToeGameInput input = TicTacToeGameInput.builder()
      .playerXUsername(playerX.getUsername())
      .playerOUsername(playerO.getUsername())
      .build();

    TicTacToeGame game = facility.create(input);

    assertNotNull(game);
    assertEquals(playerX, game.getPlayerX());
    assertEquals(playerO, game.getPlayerO());


  }


}
