package dev.kurama.api.ttt.game;

import dev.kurama.api.ttt.game.TicTacToeGameChangedEvent.TicTacToeGameChangedEventPlayer;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class TicTacToeGameChangedEventEmitter {

  @NonNull
  private final ApplicationEventPublisher applicationEventPublisher;

  public void emitTicTacToeGameChangedEvent(TicTacToeGame game, TicTacToeGameChangedEvent.Action action) {
    applicationEventPublisher.publishEvent(TicTacToeGameChangedEvent.builder()
      .gameId(game.getId())
      .playerX(TicTacToeGameChangedEventPlayer.builder()
        .id(game.getPlayerX().getId())
        .username(game.getPlayerX().getUsername())
        .build())
      .playerO(TicTacToeGameChangedEventPlayer.builder()
        .id(game.getPlayerO().getId())
        .username(game.getPlayerO().getUsername())
        .build())
      .turn(game.getTurn())
      .status(game.getStatus())
      .action(action)
      .build());
  }

  public void emitTicTacToeGameCreatedEvent(TicTacToeGame game) {
    emitTicTacToeGameChangedEvent(game, TicTacToeGameChangedEvent.Action.CREATED);
  }

  public void emitTicTacToeGameUpdatedEvent(TicTacToeGame game) {
    emitTicTacToeGameChangedEvent(game, TicTacToeGameChangedEvent.Action.UPDATED);
  }

}
