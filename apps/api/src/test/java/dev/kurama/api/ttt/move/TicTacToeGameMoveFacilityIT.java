package dev.kurama.api.ttt.move;

import static dev.kurama.api.core.utility.AuthorityUtils.setContextUser;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertThrows;

import dev.kurama.api.core.exception.domain.ForbiddenException;
import dev.kurama.api.core.filter.ContextUser;
import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.TicTacToeGameService;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import dev.kurama.api.ttt.player.TicTacToePlayerService;
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

@ServiceLayerIntegrationTestConfig
@Import({TicTacToeGameMoveFacility.class, TicTacToeGameService.class, TicTacToeGameMoveService.class,
  TicTacToePlayerService.class,})
class TicTacToeGameMoveFacilityIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private TicTacToeGameMoveFacility facility;

  @Nested
  class CreateTicTacToeGameMoveTests {

    TicTacToePlayer playerX;
    TicTacToePlayer playerO;

    TicTacToeGame game;

    @BeforeEach
    void setUp() {
      playerX = entityManager.persist(
        TicTacToePlayer.builder().setRandomUUID().username("user-1").wins(0).draws(0).losses(0).build());
      playerO = entityManager.persist(
        TicTacToePlayer.builder().setRandomUUID().username("user-2").wins(0).draws(0).losses(0).build());
      game = entityManager.persist(TicTacToeGame.builder()
        .setRandomUUID()
        .playerX(playerX)
        .playerO(playerO)
        .status(Status.IN_PROGRESS)
        .lastActivityAt(LocalDateTime.now())
        .requestedAt(LocalDateTime.now())
        .board("OX_____XO")
        .turn(Token.X)
        .build());
    }

    @Test
    void should_create_tic_tac_toe_game_move() {
      TicTacToeGameMoveInput input = TicTacToeGameMoveInput.builder().cell("B2").build();

      setContextUser(ContextUser.builder().id(playerX.getId()).username(playerX.getUsername()).build());

      TicTacToeGameMove move = facility.move(game.getId(), input);

      assertThat(move).isNotNull();
      assertThat(move.getGame()).isEqualTo(game);
      assertThat(move.getPlayer()).isEqualTo(playerX);
      assertThat(move.getCell()).isEqualTo("B2");
      assertThat(move.getMovedAt()).isNotNull();
      assertThat(move.getGame().getBoard()).isEqualTo("OX__X__XO");
      assertThat(move.getGame().getStatus()).isEqualTo(Status.FINISHED);
      assertThat(move.getGame().getPlayerX().getWins()).isEqualTo(1);
      assertThat(move.getGame().getPlayerO().getLosses()).isEqualTo(1);
    }


    @Test
    void should_throw_if_game_is_not_in_progress() {
      TicTacToeGame finishedGame = entityManager.persist(TicTacToeGame.builder()
        .setRandomUUID()
        .playerX(playerX)
        .playerO(playerO)
        .status(Status.FINISHED)
        .lastActivityAt(LocalDateTime.now())
        .requestedAt(LocalDateTime.now())
        .board("OX_____XO")
        .turn(Token.X)
        .build());

      TicTacToeGameMoveInput input = TicTacToeGameMoveInput.builder().cell("B2").build();

      setContextUser(ContextUser.builder().id(playerX.getId()).username(playerX.getUsername()).build());

      assertThrows(ForbiddenException.class, () -> facility.move(finishedGame.getId(), input));
    }

    @Test
    void should_throw_if_is_not_your_turn() {
      TicTacToeGameMoveInput input = TicTacToeGameMoveInput.builder().cell("B2").build();

      setContextUser(ContextUser.builder().id(playerO.getId()).username(playerO.getUsername()).build());

      assertThrows(ForbiddenException.class, () -> facility.move(game.getId(), input));
    }


    @Test
    void should_throw_if_illegal_move() {
      TicTacToeGameMoveInput input = TicTacToeGameMoveInput.builder().cell("A1").build();

      setContextUser(ContextUser.builder().id(playerX.getId()).username(playerX.getUsername()).build());

      assertThrows(IllegalArgumentException.class, () -> facility.move(game.getId(), input));
    }
  }

  @Nested
  class GetAllTicTacToeGameMovesTests {

    TicTacToePlayer playerX;
    TicTacToePlayer playerO;

    TicTacToeGame game;

    @BeforeEach
    void setUp() {
      playerX = entityManager.persist(TicTacToePlayer.builder().setRandomUUID().username("user-1").build());
      playerO = entityManager.persist(TicTacToePlayer.builder().setRandomUUID().username("user-2").build());
      game = entityManager.persist(TicTacToeGame.builder()
        .setRandomUUID()
        .playerX(playerX)
        .playerO(playerO)
        .status(Status.IN_PROGRESS)
        .lastActivityAt(LocalDateTime.now())
        .requestedAt(LocalDateTime.now())
        .board("OX_____XO")
        .turn(Token.X)
        .moves(Set.of(TicTacToeGameMove.builder()
          .setRandomUUID()
          .game(game)
          .player(playerX)
          .cell("A2")
          .board("_X________")
          .movedAt(LocalDateTime.now())
          .moveTime(1000L)
          .token(Token.X)
          .number(1)
          .build(), TicTacToeGameMove.builder()
          .setRandomUUID()
          .game(game)
          .player(playerO)
          .cell("A1")
          .board("OX_______")
          .movedAt(LocalDateTime.now())
          .moveTime(1000L)
          .token(Token.O)
          .number(2)
          .build(), TicTacToeGameMove.builder()
          .setRandomUUID()
          .game(game)
          .player(playerX)
          .cell("C2")
          .board("OX_____X_")
          .movedAt(LocalDateTime.now())
          .moveTime(1000L)
          .token(Token.X)
          .number(3)
          .build(), TicTacToeGameMove.builder()
          .setRandomUUID()
          .game(game)
          .player(playerO)
          .cell("C3")
          .board("OX_____XO")
          .movedAt(LocalDateTime.now())
          .moveTime(1000L)
          .token(Token.O)
          .number(4)
          .build()))
        .build());
    }

    @Test
    void should_get_all_tic_tac_toe_game_moves() {
      setContextUser(ContextUser.builder().id(playerX.getId()).username(playerX.getUsername()).build());

      Collection<TicTacToeGameMove> moves = facility.getAllGameMoves(game.getId());

      assertThat(moves).hasSize(4);

      assertThat(moves.stream().map(TicTacToeGameMove::getCell).toList()).containsExactly("A2", "A1", "C2", "C3");
    }

    @Test
    void should_throw_if_private_game() {
      game.setPrivate(true);
      entityManager.persist(game);

      setContextUser(ContextUser.builder().id(randomUUID()).build());

      assertThrows(ForbiddenException.class, () -> facility.getAllGameMoves(game.getId()));
    }
  }

}
