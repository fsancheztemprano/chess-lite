package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.utility.AuthorityUtils.setContextUser;
import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.exception.domain.ForbiddenException;
import dev.kurama.api.core.filter.ContextUser;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.input.TicTacToeGameInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameStatusInput;
import dev.kurama.api.ttt.move.TicTacToeGameMove;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToeGameServiceTest {

  @InjectMocks
  private TicTacToeGameService service;

  @Mock
  private TicTacToeGameRepository repository;

  @Mock
  private TicTacToeGameChangedEventEmitter eventEmitter;

  TicTacToeGame expected = TicTacToeGame.builder()
    .setRandomUUID()
    .status(Status.PENDING)
    .lastActivityAt(LocalDateTime.now())
    .requestedAt(LocalDateTime.now())
    .build();

  @Test
  void should_find_game_by_id() {
    when(repository.findById(expected.getId())).thenReturn(Optional.of(expected));

    TicTacToeGame actual = service.findById(expected.getId());

    assertEquals(expected, actual);
  }

  @Nested
  class CreateTicTacToeGameTests {

    @Test
    void should_create_game() {
      TicTacToePlayer playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
      TicTacToePlayer playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();
      TicTacToeGameInput input = TicTacToeGameInput.builder()
        .playerOUsername(playerO.getUsername())
        .isPrivate(true)
        .build();

      when(repository.save(any(TicTacToeGame.class))).thenAnswer(invocation -> invocation.getArgument(0));

      TicTacToeGame actual = service.create(input, playerX, playerO);

      verify(eventEmitter).emitTicTacToeGameCreatedEvent(actual);
      assertEquals(playerX, actual.getPlayerX());
      assertEquals(playerO, actual.getPlayerO());
      assertEquals(input.getIsPrivate(), actual.isPrivate());
      assertEquals(Status.PENDING, actual.getStatus());
      assertNotNull(actual.getLastActivityAt());
      assertNotNull(actual.getRequestedAt());
    }

    @Test
    void should_throw_if_game_between_players_already_exists() {
      TicTacToePlayer playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
      TicTacToePlayer playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();
      TicTacToeGameInput input = TicTacToeGameInput.builder()
        .playerXUsername(playerX.getUsername())
        .playerOUsername(playerO.getUsername())
        .build();

      when(repository.save(any(TicTacToeGame.class))).thenAnswer(invocation -> invocation.getArgument(0));
      when(repository.existsTicTacToeGameByPlayerXIdInAndPlayerOIdInAndStatus(any(), any(),
        eq(Status.PENDING))).thenReturn(true);

      assertThrows(IllegalArgumentException.class, () -> service.create(input, playerX, playerO));
    }
  }

  @Nested
  class UpdateTicTacToeGameStatusTests {

    TicTacToePlayer playerX;
    TicTacToePlayer playerO;
    TicTacToeGame game;

    @BeforeEach
    void setUp() {
      playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
      playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();
      game = TicTacToeGame.builder()
        .setRandomUUID()
        .playerX(playerX)
        .playerO(playerO)
        .status(Status.PENDING)
        .lastActivityAt(LocalDateTime.now())
        .requestedAt(LocalDateTime.now())
        .build();

      setCurrentPlayer(playerO);
    }

    @Test
    void should_update_game_status_as_opponent() {
      TicTacToeGameStatusInput input = TicTacToeGameStatusInput.builder().status(Status.IN_PROGRESS.toString()).build();

      when(repository.save(any(TicTacToeGame.class))).thenAnswer(invocation -> invocation.getArgument(0));
      when(repository.findById(game.getId())).thenReturn(Optional.of(game));

      TicTacToeGame actual = service.updateStatus(game.getId(), input);

      verify(eventEmitter).emitTicTacToeGameUpdatedEvent(actual);
      assertEquals(input.getStatus(), actual.getStatus().toString());
      assertNotNull(actual.getLastActivityAt());
      assertNotNull(actual.getStartedAt());
      assertEquals("_________", actual.getBoard());
      assertEquals(Token.X, actual.getTurn());
    }

    @Test
    void should_update_any_game_status_as_admin() {
      setContextUser(ContextUser.builder().id("admin").username("admin").build(),
        TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE);

      TicTacToeGameStatusInput input = TicTacToeGameStatusInput.builder().status(Status.REJECTED.toString()).build();

      when(repository.save(any(TicTacToeGame.class))).thenAnswer(invocation -> invocation.getArgument(0));
      when(repository.findById(game.getId())).thenReturn(Optional.of(game));

      TicTacToeGame actual = service.updateStatus(game.getId(), input);

      verify(eventEmitter).emitTicTacToeGameUpdatedEvent(actual);
      assertEquals(input.getStatus(), actual.getStatus().toString());
      assertNotNull(actual.getLastActivityAt());
    }

    @Test
    void should_throw_if_game_not_found() {
      TicTacToeGameStatusInput input = TicTacToeGameStatusInput.builder().status(Status.REJECTED.toString()).build();

      when(repository.findById(any())).thenReturn(Optional.empty());

      assertThrows(NoSuchElementException.class, () -> service.updateStatus("game-1", input));
    }

    @Test
    void should_throw_if_game_status_is_not_pending() {
      game.setStatus(Status.IN_PROGRESS);

      TicTacToeGameStatusInput input = TicTacToeGameStatusInput.builder().status(Status.REJECTED.toString()).build();

      when(repository.findById(game.getId())).thenReturn(Optional.of(game));

      assertThrows(ForbiddenException.class, () -> service.updateStatus(game.getId(), input));
    }

    @Test
    void should_throw_if_game_status_is_not_pending_for_current_user() {
      setCurrentPlayer(playerX);
      game.setStatus(Status.IN_PROGRESS);

      TicTacToeGameStatusInput input = TicTacToeGameStatusInput.builder().status(Status.REJECTED.toString()).build();

      when(repository.findById(game.getId())).thenReturn(Optional.of(game));

      assertThrows(ForbiddenException.class, () -> service.updateStatus(game.getId(), input));
    }

    @Test
    void should_throw_if_game_status_is_not_valid() {
      TicTacToeGameStatusInput input = TicTacToeGameStatusInput.builder().status("INVALID").build();

      when(repository.findById(game.getId())).thenReturn(Optional.of(game));

      assertThrows(IllegalArgumentException.class, () -> service.updateStatus(game.getId(), input));
    }

    private void setCurrentPlayer(TicTacToePlayer playerO) {
      setContextUser(ContextUser.builder().id(playerO.getId()).username(playerO.getUsername()).build());
    }
  }

  @Nested
  class ApplyTicTacToeGameMoveTests {

    TicTacToePlayer playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
    TicTacToePlayer playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();

    @Test
    void should_apply_move() {
      TicTacToeGame game = TicTacToeGame.builder()
        .setRandomUUID()
        .playerX(playerX)
        .playerO(playerO)
        .status(Status.IN_PROGRESS)
        .lastActivityAt(LocalDateTime.now())
        .requestedAt(LocalDateTime.now())
        .board("_________")
        .turn(Token.X)
        .build();

      TicTacToeGameMove move = TicTacToeGameMove.builder()
        .game(game)
        .board("X________")
        .cell("C1")
        .token(Token.X)
        .number(1)
        .movedAt(LocalDateTime.now())
        .moveTime(1000L)
        .build();

      when(repository.save(any(TicTacToeGame.class))).thenAnswer(invocation -> invocation.getArgument(0));

      TicTacToeGame actual = service.applyMove(game, move);

      verify(eventEmitter).emitTicTacToeGameUpdatedEvent(actual);
      assertEquals("X________", actual.getBoard());
      assertEquals(Token.O, actual.getTurn());
      assertTrue(actual.getMoves().contains(move));
      assertNotNull(actual.getLastActivityAt());
    }

    @Test
    void should_move_to_win() {
      TicTacToeGame game = TicTacToeGame.builder()
        .setRandomUUID()
        .playerX(playerX)
        .playerO(playerO)
        .status(Status.IN_PROGRESS)
        .lastActivityAt(LocalDateTime.now())
        .requestedAt(LocalDateTime.now())
        .board("XO_XO____")
        .turn(Token.X)
        .build();

      TicTacToeGameMove move = TicTacToeGameMove.builder()
        .game(game)
        .board("XO_XO_X__")
        .cell("C2")
        .token(Token.X)
        .number(5)
        .movedAt(LocalDateTime.now())
        .moveTime(1000L)
        .build();

      when(repository.save(any(TicTacToeGame.class))).thenAnswer(invocation -> invocation.getArgument(0));

      TicTacToeGame actual = service.applyMove(game, move);

      verify(eventEmitter).emitTicTacToeGameUpdatedEvent(actual);
      assertEquals("XO_XO_X__", actual.getBoard());
      assertEquals(Token.X, actual.getTurn());
      assertTrue(actual.getMoves().contains(move));
      assertNotNull(actual.getFinishedAt());
      assertEquals(Status.FINISHED, actual.getStatus());
    }

    @Test
    void should_move_to_tie() {
      TicTacToeGame game = TicTacToeGame.builder()
        .setRandomUUID()
        .playerX(playerX)
        .playerO(playerO)
        .status(Status.IN_PROGRESS)
        .lastActivityAt(LocalDateTime.now())
        .requestedAt(LocalDateTime.now())
        .board("XXOOOXX_O")
        .turn(Token.X)
        .build();

      TicTacToeGameMove move = TicTacToeGameMove.builder()
        .game(game)
        .board("XXOOOXXXO")
        .cell("A2")
        .token(Token.X)
        .number(9)
        .movedAt(LocalDateTime.now())
        .moveTime(1000L)
        .build();

      when(repository.save(any(TicTacToeGame.class))).thenAnswer(invocation -> invocation.getArgument(0));

      TicTacToeGame actual = service.applyMove(game, move);

      verify(eventEmitter).emitTicTacToeGameUpdatedEvent(actual);
      assertEquals("XXOOOXXXO", actual.getBoard());
      assertEquals(Token.NONE, actual.getTurn());
      assertTrue(actual.getMoves().contains(move));
      assertNotNull(actual.getFinishedAt());
      assertEquals(Status.FINISHED, actual.getStatus());
    }
  }

  @Test
  void should_get_all_games() {
    TicTacToePlayer playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
    TicTacToePlayer playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();

    TicTacToeGame game1 = TicTacToeGame.builder()
      .setRandomUUID()
      .playerX(playerX)
      .playerO(playerO)
      .status(Status.IN_PROGRESS)
      .lastActivityAt(LocalDateTime.now())
      .requestedAt(LocalDateTime.now())
      .board("_________")
      .turn(Token.X)
      .build();

    TicTacToeGame game2 = TicTacToeGame.builder()
      .setRandomUUID()
      .playerX(playerX)
      .playerO(playerO)
      .status(Status.IN_PROGRESS)
      .lastActivityAt(LocalDateTime.now())
      .requestedAt(LocalDateTime.now())
      .board("_________")
      .turn(Token.X)
      .build();

    PageImpl<TicTacToeGame> expected = new PageImpl<>(Arrays.asList(game1, game2));

    PageRequest pageRequest = PageRequest.of(0, 10, Sort.by("requestedAt").descending());

    when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(expected);

    Page<TicTacToeGame> actual = service.getAll(pageRequest, null);

    assertEquals(expected, actual);
  }
}
