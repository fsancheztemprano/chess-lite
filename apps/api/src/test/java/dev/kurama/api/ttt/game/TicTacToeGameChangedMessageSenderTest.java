package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.ttt.game.TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAMES_CHANGED_CHANNEL;
import static dev.kurama.api.ttt.game.TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_CHANGED_CHANNEL;
import static dev.kurama.api.ttt.game.TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL;
import static java.lang.String.format;
import static org.mockito.Mockito.verify;

import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToeGameChangedMessageSenderTest {

  @InjectMocks
  private TicTacToeGameChangedMessageSender ticTacToeGameChangedMessageSender;

  @Mock
  private SimpMessagingTemplate template;

  @Test
  void should_send_tic_tac_toe_game_changed_messages() {
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

    ticTacToeGameChangedMessageSender.sendTicTacToeGameChangedMessage(event);

    verify(template).convertAndSend(TIC_TAC_TOE_GAMES_CHANGED_CHANNEL, event);
    verify(template).convertAndSend(format(TIC_TAC_TOE_GAME_CHANGED_CHANNEL, event.getGameId()), event);
    verify(template).convertAndSend(format(TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL, event.getPlayerX().getId()), event);
    verify(template).convertAndSend(format(TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL, event.getPlayerO().getId()), event);
  }
}
