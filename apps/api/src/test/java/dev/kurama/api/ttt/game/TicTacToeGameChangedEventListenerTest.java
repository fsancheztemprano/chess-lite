package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.mockito.Mockito.verify;

import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToeGameChangedEventListenerTest {

  @InjectMocks
  private TicTacToeGameChangedEventListener ticTacToeGameChangedEventListener;

  @Mock
  private TicTacToeGameChangedMessageSender sender;

  @Test
  void tic_tac_toe_game_changed_event_should_send_tic_tac_toe_game_changed_message() {
    TicTacToeGameChangedEvent event = TicTacToeGameChangedEvent.builder()
      .gameId(randomUUID())
      .action(TicTacToeGameChangedEvent.Action.CREATED)
      .playerX(TicTacToeGameChangedEvent.TicTacToeGameChangedEventPlayer.builder()
        .id(randomUUID())
        .username("playerX")
        .build())
      .playerO(TicTacToeGameChangedEvent.TicTacToeGameChangedEventPlayer.builder()
        .id(randomUUID())
        .username("playerO")
        .build())
      .status(Status.IN_PROGRESS)
      .turn(Token.X)
      .build();

    ticTacToeGameChangedEventListener.ticTacToeGameChangedEvent(event);

    verify(sender).sendTicTacToeGameChangedMessage(event);
  }

}
