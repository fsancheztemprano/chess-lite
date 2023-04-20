package dev.kurama.api.pact;

import static com.google.common.collect.Lists.newArrayList;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.TicTacToeGameController;
import dev.kurama.api.ttt.game.TicTacToeGameFacade;
import dev.kurama.api.ttt.game.TicTacToeGameFacility;
import dev.kurama.api.ttt.game.TicTacToeGameModelAssembler;
import dev.kurama.api.ttt.game.TicTacToeGameModelProcessor;
import dev.kurama.api.ttt.game.TicTacToeGameService;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import dev.kurama.support.TicTacToeMappers;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;

@WebMvcTest(controllers = TicTacToeGameController.class)
@Import({TicTacToeGameFacade.class, TicTacToeGameModelProcessor.class, TicTacToeGameModelAssembler.class})
@TicTacToeMappers
public abstract class TicTacToeGameControllerBase extends PactBase {


  @MockBean
  private TicTacToeGameService service;

  @MockBean
  private TicTacToeGameFacility facility;


  @Override
  protected void beforeEach() throws Exception {
    TicTacToePlayer playerA = TicTacToePlayer.builder()
      .id("tic-tac-toe-p1")
      .user(User.builder().id("tic-tac-toe-p1").username("tic-tac-toe-p1").build())
      .username("tic-tac-toe-p1")
      .build();
    TicTacToePlayer playerB = TicTacToePlayer.builder()
      .id("tic-tac-toe-p2")
      .user(User.builder().id("tic-tac-toe-p2").username("tic-tac-toe-p2").build())
      .username("tic-tac-toe-p2")
      .build();
    TicTacToeGame game1 = TicTacToeGame.builder()
      .id("tic-tac-toe-g1")
      .status(Status.PENDING)
      .isPrivate(true)
      .requestedAt(LocalDateTime.ofEpochSecond(1000000 / 1000, 0, ZoneOffset.UTC))
      .lastActivityAt(LocalDateTime.ofEpochSecond(1000000 / 1000, 0, ZoneOffset.UTC))
      .playerX(playerA)
      .playerO(playerB)
      .build();
    TicTacToeGame game2 = TicTacToeGame.builder()
      .id("tic-tac-toe-g2")
      .status(Status.IN_PROGRESS)
      .isPrivate(false)
      .requestedAt(LocalDateTime.ofEpochSecond(1000000 / 1000, 0, ZoneOffset.UTC))
      .lastActivityAt(LocalDateTime.ofEpochSecond(2000000 / 1000, 0, ZoneOffset.UTC))
      .startedAt(LocalDateTime.ofEpochSecond(2000000 / 1000, 0, ZoneOffset.UTC))
      .playerX(playerA)
      .playerO(playerB)
      .turn(Token.X)
      .board("XXOOO_X__")
      .build();

    TicTacToeGame game3 = TicTacToeGame.builder()
      .id("tic-tac-toe-g3")
      .status(Status.REJECTED)
      .isPrivate(true)
      .requestedAt(LocalDateTime.ofEpochSecond(1000000 / 1000, 0, ZoneOffset.UTC))
      .lastActivityAt(LocalDateTime.ofEpochSecond(3000000 / 1000, 0, ZoneOffset.UTC))
      .playerX(playerA)
      .playerO(playerB)
      .build();

    TicTacToeGame game4 = TicTacToeGame.builder()
      .id("tic-tac-toe-g4")
      .status(Status.FINISHED)
      .isPrivate(false)
      .lastActivityAt(LocalDateTime.ofEpochSecond(4000000 / 1000, 0, ZoneOffset.UTC))
      .requestedAt(LocalDateTime.ofEpochSecond(1000000 / 1000, 0, ZoneOffset.UTC))
      .startedAt(LocalDateTime.ofEpochSecond(2000000 / 1000, 0, ZoneOffset.UTC))
      .finishedAt(LocalDateTime.ofEpochSecond(4000000 / 1000, 0, ZoneOffset.UTC))
      .playerX(playerA)
      .playerO(playerB)
      .turn(Token.O)
      .board("XXOOOOX_X")
      .build();

    PageImpl<TicTacToeGame> page = new PageImpl<>(newArrayList(game1, game2, game3, game4));

    doThrow(EntityNotFoundException.class).when(service).findById(anyString());
    doReturn(game1).when(service).findById(game1.getId());
    doReturn(game2).when(service).findById(game2.getId());
    doReturn(game3).when(service).findById(game3.getId());
    doReturn(game4).when(service).findById(game4.getId());

    doReturn(game1).when(facility).create(any());

    doThrow(EntityNotFoundException.class).when(service).updateStatus(anyString(), any());
    doReturn(game2).when(service).updateStatus(eq(game2.getId()), any());
    doReturn(game3).when(service).updateStatus(eq(game3.getId()), any());

    doReturn(page).when(service).getAll(any(), any());
  }
}
