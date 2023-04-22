package dev.kurama.api.ttt.move;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.ttt.core.TicTacToeAuthority.TIC_TAC_TOE_GAME_READ;
import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.exception.domain.ForbiddenException;
import dev.kurama.api.core.filter.ContextUser;
import dev.kurama.api.core.utility.AuthorityUtils;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.TicTacToeGameService;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import dev.kurama.api.ttt.player.TicTacToePlayerService;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToeGameMoveFacilityTest {

  @InjectMocks
  private TicTacToeGameMoveFacility facility;

  @Mock
  private TicTacToeGameService ticTacToeGameService;

  @Mock
  private TicTacToeGameMoveService ticTacToeGameMoveService;

  @Mock
  private TicTacToePlayerService ticTacToePlayerService;


  TicTacToePlayer playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
  TicTacToePlayer playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();
  TicTacToeGame game = TicTacToeGame.builder()
    .setRandomUUID()
    .playerX(playerX)
    .playerO(playerO)
    .status(Status.IN_PROGRESS)
    .lastActivityAt(LocalDateTime.now())
    .requestedAt(LocalDateTime.now())
    .board("OX_____XO")
    .turn(Token.X)
    .build();

  TicTacToeGameMove move = TicTacToeGameMove.builder()
    .game(game)
    .board("OX__X__XO")
    .cell("B2")
    .token(Token.X)
    .number(1)
    .movedAt(LocalDateTime.now())
    .moveTime(1000L)
    .build();

  @Nested
  class TicTacToeGameMoveTests {

    TicTacToeGameMoveInput input = TicTacToeGameMoveInput.builder().cell("B2").build();

    @Test
    void should_move_as_current_turn_user() {
      AuthorityUtils.setContextUser(ContextUser.builder().id(playerX.getId()).build());
      when(ticTacToeGameService.findById(game.getId())).thenReturn(game);
      when(ticTacToeGameMoveService.createMove(game, input.getCell())).thenReturn(move);
      when(ticTacToeGameService.applyMove(game, move)).thenReturn(game);

      TicTacToeGameMove actual = facility.move(game.getId(), input);

      assertEquals(actual, move);
      verify(ticTacToePlayerService, never()).registerGameResult(any(), any(), any());
    }

    @Test
    void should_move_as_admin() {
      AuthorityUtils.setContextUser(ContextUser.builder().id(randomUUID()).build(),
        TicTacToeAuthority.TIC_TAC_TOE_GAME_MOVE);

      when(ticTacToeGameService.findById(game.getId())).thenReturn(game);
      when(ticTacToeGameMoveService.createMove(game, input.getCell())).thenReturn(move);
      when(ticTacToeGameService.applyMove(game, move)).thenReturn(game);

      TicTacToeGameMove actual = facility.move(game.getId(), input);

      assertEquals(actual, move);
      verify(ticTacToePlayerService, never()).registerGameResult(any(), any(), any());
    }


    @Test
    void should_final_move_and_update_player_counters() {
      AuthorityUtils.setContextUser(ContextUser.builder().id(playerX.getId()).build());
      TicTacToeGame finishedGame = TicTacToeGame.builder()
        .id(game.getId())
        .playerX(playerX)
        .playerO(playerO)
        .status(Status.FINISHED)
        .lastActivityAt(LocalDateTime.now())
        .requestedAt(LocalDateTime.now())
        .board("OX__X__XO")
        .turn(Token.X)
        .build();
      when(ticTacToeGameService.findById(game.getId())).thenReturn(game);
      when(ticTacToeGameMoveService.createMove(game, input.getCell())).thenReturn(move);
      when(ticTacToeGameService.applyMove(game, move)).thenReturn(finishedGame);

      TicTacToeGameMove actual = facility.move(game.getId(), input);

      assertEquals(actual, move);
      verify(ticTacToePlayerService).registerGameResult(playerX, playerO, game.getTurn());
    }

    @ParameterizedTest
    @EnumSource(value = Status.class, mode = EnumSource.Mode.EXCLUDE, names = {"IN_PROGRESS"})
    void should_throw_if_game_is_not_in_progress(Status status) {
      AuthorityUtils.setContextUser(ContextUser.builder().id(playerX.getId()).build());
      TicTacToeGame notInProgress = TicTacToeGame.builder()
        .id(game.getId())
        .playerX(playerX)
        .playerO(playerO)
        .status(status)
        .lastActivityAt(LocalDateTime.now())
        .requestedAt(LocalDateTime.now())
        .board("OX__X__XO")
        .turn(Token.X)
        .build();
      when(ticTacToeGameService.findById(game.getId())).thenReturn(notInProgress);

      assertThrows(ForbiddenException.class, () -> facility.move(game.getId(), input));

      verify(ticTacToeGameMoveService, never()).createMove(any(), any());
      verify(ticTacToeGameService, never()).applyMove(any(), any());
      verify(ticTacToePlayerService, never()).registerGameResult(any(), any(), any());
    }

    @Test
    void should_throw_if_not_current_user_turn() {
      AuthorityUtils.setContextUser(ContextUser.builder().id(playerO.getId()).build());
      when(ticTacToeGameService.findById(game.getId())).thenReturn(game);

      assertThrows(ForbiddenException.class, () -> facility.move(game.getId(), input));

      verify(ticTacToeGameMoveService, never()).createMove(any(), any());
      verify(ticTacToeGameService, never()).applyMove(any(), any());
      verify(ticTacToePlayerService, never()).registerGameResult(any(), any(), any());
    }

    @Test
    void should_throw_if_illegal_move() {
      AuthorityUtils.setContextUser(ContextUser.builder().id(playerX.getId()).build());
      TicTacToeGameMoveInput illegalMoveInput = TicTacToeGameMoveInput.builder().cell("A2").build();
      when(ticTacToeGameService.findById(game.getId())).thenReturn(game);

      assertThrows(IllegalArgumentException.class, () -> facility.move(game.getId(), illegalMoveInput));

      verify(ticTacToeGameMoveService, never()).createMove(any(), any());
      verify(ticTacToeGameService, never()).applyMove(any(), any());
      verify(ticTacToePlayerService, never()).registerGameResult(any(), any(), any());
    }
  }

  @Nested
  class TicTacToeGameMoveServiceTests {

    TicTacToePlayer playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
    TicTacToePlayer playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();
    TicTacToeGame game = TicTacToeGame.builder()
      .setRandomUUID()
      .playerX(playerX)
      .playerO(playerO)
      .status(Status.IN_PROGRESS)
      .lastActivityAt(LocalDateTime.now())
      .requestedAt(LocalDateTime.now())
      .board("OX_____XO")
      .turn(Token.X)
      .build();

    TicTacToeGameMove move = TicTacToeGameMove.builder()
      .game(game)
      .board("OX__X__XO")
      .cell("B2")
      .token(Token.X)
      .number(1)
      .movedAt(LocalDateTime.now())
      .moveTime(1000L)
      .build();

    @Test
    void should_get_all_game_moves_as_x() {
      AuthorityUtils.setContextUser(ContextUser.builder().id(playerX.getId()).build());
      game.setMoves(Set.of(move));
      game.setPrivate(true);
      when(ticTacToeGameService.findById(game.getId())).thenReturn(game);

      Collection<TicTacToeGameMove> actual = facility.getAllGameMoves(game.getId());

      assertEquals(actual, List.of(move));
    }

    @Test
    void should_get_all_game_moves_as_o() {
      AuthorityUtils.setContextUser(ContextUser.builder().id(playerO.getId()).build());
      game.setMoves(Set.of(move));
      game.setPrivate(true);
      when(ticTacToeGameService.findById(game.getId())).thenReturn(game);

      Collection<TicTacToeGameMove> actual = facility.getAllGameMoves(game.getId());

      assertEquals(actual, List.of(move));
    }

    @Test
    void should_get_all_game_moves_as_admin() {
      AuthorityUtils.setContextUser(ContextUser.builder().id(randomUUID()).build(), TIC_TAC_TOE_GAME_READ);
      game.setMoves(Set.of(move));
      game.setPrivate(true);
      when(ticTacToeGameService.findById(game.getId())).thenReturn(game);

      Collection<TicTacToeGameMove> actual = facility.getAllGameMoves(game.getId());

      assertEquals(actual, List.of(move));
    }

    @Test
    void should_throw_if_private_and_not_admin_nor_involved_player() {
      AuthorityUtils.setContextUser(ContextUser.builder().id(randomUUID()).build());
      game.setPrivate(true);
      when(ticTacToeGameService.findById(game.getId())).thenReturn(game);

      assertThrows(ForbiddenException.class, () -> facility.getAllGameMoves(game.getId()));
    }
  }

}
