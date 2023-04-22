package dev.kurama.api.ttt.game;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToeGameChangedEventEmitterTest {

  @InjectMocks
  private TicTacToeGameChangedEventEmitter ticTacToeGameChangedEventEmitter;

  @Mock
  private ApplicationEventPublisher applicationEventPublisher;

  TicTacToePlayer playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
  TicTacToePlayer playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();

  TicTacToeGame game = TicTacToeGame.builder()
    .setRandomUUID()
    .playerX(playerX)
    .playerO(playerO)
    .status(Status.PENDING)
    .lastActivityAt(LocalDateTime.now())
    .requestedAt(LocalDateTime.now())
    .board("_________")
    .turn(Token.X)
    .build();

  @Test
  void tic_tac_toe_game_created_event_should_send_tic_tac_toe_game_created_message() {
    ticTacToeGameChangedEventEmitter.emitTicTacToeGameCreatedEvent(game);

    ArgumentCaptor<TicTacToeGameChangedEvent> argument = ArgumentCaptor.forClass(TicTacToeGameChangedEvent.class);
    verify(applicationEventPublisher).publishEvent(argument.capture());

    TicTacToeGameChangedEvent capturedEvent = argument.getValue();
    assertTicTacToeGameChangedEvent(capturedEvent, TicTacToeGameChangedEvent.Action.CREATED);
  }


  @Test
  void tic_tac_toe_game_updated_event_should_send_tic_tac_toe_game_updated_message() {
    ticTacToeGameChangedEventEmitter.emitTicTacToeGameUpdatedEvent(game);

    ArgumentCaptor<TicTacToeGameChangedEvent> argument = ArgumentCaptor.forClass(TicTacToeGameChangedEvent.class);
    verify(applicationEventPublisher).publishEvent(argument.capture());

    TicTacToeGameChangedEvent capturedEvent = argument.getValue();
    assertTicTacToeGameChangedEvent(capturedEvent, TicTacToeGameChangedEvent.Action.UPDATED);
  }

  private void assertTicTacToeGameChangedEvent(TicTacToeGameChangedEvent capturedEvent,
                                               TicTacToeGameChangedEvent.Action action) {
    assertEquals(game.getId(), capturedEvent.getGameId());
    assertEquals(game.getPlayerX().getId(), capturedEvent.getPlayerX().getId());
    assertEquals(game.getPlayerX().getUsername(), capturedEvent.getPlayerX().getUsername());
    assertEquals(game.getPlayerO().getId(), capturedEvent.getPlayerO().getId());
    assertEquals(game.getPlayerO().getUsername(), capturedEvent.getPlayerO().getUsername());
    assertEquals(game.getStatus(), capturedEvent.getStatus());
    assertEquals(game.getTurn(), capturedEvent.getTurn());
    assertEquals(action, capturedEvent.getAction());
  }

}
