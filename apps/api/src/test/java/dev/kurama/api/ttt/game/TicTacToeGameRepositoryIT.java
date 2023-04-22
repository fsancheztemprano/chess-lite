package dev.kurama.api.ttt.game;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import java.util.Set;
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
class TicTacToeGameRepositoryIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private TicTacToeGameRepository ticTacToeGameRepository;
  TicTacToePlayer playerX;
  TicTacToePlayer playerO;
  TicTacToePlayer playerR;


  @BeforeEach
  void setUp() {
    playerX = TicTacToePlayer.builder().setRandomUUID().username(randomAlphanumeric(8)).build();
    entityManager.persist(playerX);
    playerO = TicTacToePlayer.builder().setRandomUUID().username(randomAlphanumeric(8)).build();
    entityManager.persist(playerO);
    playerR = TicTacToePlayer.builder().setRandomUUID().username(randomAlphanumeric(8)).build();
    entityManager.persist(playerR);
  }

  @Test
  void should_return_true_when_exists_tic_tac_toe_game_by_player_x_id_in_and_player_o_id_in_and_status() {
    TicTacToeGame game = TicTacToeGame.builder()
      .setRandomUUID()
      .playerX(playerX)
      .playerO(playerO)
      .status(Status.PENDING)
      .build();
    entityManager.persist(game);

    boolean actual = ticTacToeGameRepository.existsTicTacToeGameByPlayerXIdInAndPlayerOIdInAndStatus(
      Set.of(playerX.getId()), Set.of(playerO.getId()), Status.PENDING);

    assertThat(actual).isTrue();
  }

  @Test
  void should_return_false_if_game_with_player_but_different_status() {
    TicTacToeGame game = TicTacToeGame.builder()
      .setRandomUUID()
      .playerX(playerX)
      .playerO(playerO)
      .status(Status.PENDING)
      .build();
    entityManager.persist(game);

    boolean actual = ticTacToeGameRepository.existsTicTacToeGameByPlayerXIdInAndPlayerOIdInAndStatus(
      Set.of(playerX.getId()), Set.of(playerO.getId()), Status.IN_PROGRESS);

    assertThat(actual).isFalse();
  }


  @Test
  void should_return_false_if_game_with_Status_but_different_player() {
    TicTacToeGame game = TicTacToeGame.builder()
      .setRandomUUID()
      .playerX(playerX)
      .playerO(playerR)
      .status(Status.PENDING)
      .build();
    entityManager.persist(game);

    boolean actual = ticTacToeGameRepository.existsTicTacToeGameByPlayerXIdInAndPlayerOIdInAndStatus(
      Set.of(playerX.getId()), Set.of(playerO.getId()), Status.PENDING);

    assertThat(actual).isFalse();
  }

}
