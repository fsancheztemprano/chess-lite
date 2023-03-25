package dev.kurama.api.pact;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.move.TicTacToeGameMove;
import dev.kurama.api.ttt.move.TicTacToeGameMoveController;
import dev.kurama.api.ttt.move.TicTacToeGameMoveFacade;
import dev.kurama.api.ttt.move.TicTacToeGameMoveFacility;
import dev.kurama.api.ttt.move.TicTacToeGameMoveModelAssembler;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import dev.kurama.support.TicTacToeMappers;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

@WebMvcTest(controllers = TicTacToeGameMoveController.class)
@Import({TicTacToeGameMoveFacade.class, TicTacToeGameMoveModelAssembler.class})
@TicTacToeMappers
public abstract class TicTacToeMoveControllerBase extends PactBase {


  @MockBean
  private TicTacToeGameMoveFacility facility;


  @Override
  protected void beforeEach() throws Exception {
    TicTacToeGame game2 = TicTacToeGame.builder()
      .id("tic-tac-toe-g2")
      .status(Status.IN_PROGRESS)
      .isPrivate(false)
      .requestedAt(LocalDateTime.ofEpochSecond(1000000 / 1000, 0, ZoneOffset.UTC))
      .lastActivityAt(LocalDateTime.ofEpochSecond(2000000 / 1000, 0, ZoneOffset.UTC))
      .startedAt(LocalDateTime.ofEpochSecond(2000000 / 1000, 0, ZoneOffset.UTC))
      .build();

    TicTacToeGameMove move = TicTacToeGameMove.builder()
      .id("tic-tac-toe-gm1")
      .cell("B3")
      .token(Token.X)
      .board("X________")
      .number(1)
      .player(TicTacToePlayer.builder()
        .id("tic-tac-toe-p1")
        .user(User.builder().id("tic-tac-toe-p1").username("tic-tac-toe-p1").build())
        .wins(5)
        .losses(3)
        .draws(1)
        .build())
      .movedAt(LocalDateTime.ofEpochSecond(6000000 / 1000, 0, ZoneOffset.UTC))
      .moveTime(5000L)
      .game(game2)
      .build();

    doThrow(EntityNotFoundException.class).when(facility).move(anyString(), any());
    doReturn(move).when(facility).move(eq(move.getGame().getId()), any());
  }
}
