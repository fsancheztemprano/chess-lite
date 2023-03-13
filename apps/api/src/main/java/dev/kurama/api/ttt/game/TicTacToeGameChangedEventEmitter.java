package dev.kurama.api.ttt.game;

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
      .playerO(new TicTacToeGameChangedEvent.TicTacToeMessagePlayer(game.getPlayerO().getId(),
        game.getPlayerO().getUser().getUsername()))
      .playerX(new TicTacToeGameChangedEvent.TicTacToeMessagePlayer(game.getPlayerX().getId(),
        game.getPlayerX().getUser().getUsername()))
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
