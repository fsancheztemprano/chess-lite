package dev.kurama.api.ttt.move;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToeGameMoveServiceTest {

  @InjectMocks
  private TicTacToeGameMoveService service;

  @Mock
  private TicTacToeGameMoveRepository repository;

  @Test
  void should_create_move() {
    TicTacToeGame game = TicTacToeGame.builder()
      .setRandomUUID()
      .status(Status.IN_PROGRESS)
      .isPrivate(false)
      .turn(TicTacToePlayer.Token.X)
      .board("_________")
      .requestedAt(LocalDateTime.ofEpochSecond(1000000 / 1000, 0, ZoneOffset.UTC))
      .lastActivityAt(LocalDateTime.ofEpochSecond(2000000 / 1000, 0, ZoneOffset.UTC))
      .startedAt(LocalDateTime.ofEpochSecond(2000000 / 1000, 0, ZoneOffset.UTC))
      .build();

    service.createMove(game, "B2");

    ArgumentCaptor<TicTacToeGameMove> argument = ArgumentCaptor.forClass(TicTacToeGameMove.class);
    verify(repository).save(argument.capture());

    TicTacToeGameMove actual = argument.getValue();
    assertEquals(game, actual.getGame());
    assertEquals("B2", actual.getCell());
    assertEquals(TicTacToePlayer.Token.X, actual.getToken());
    assertEquals(1, actual.getNumber());
    assertEquals("____X____", actual.getBoard());


  }

}
