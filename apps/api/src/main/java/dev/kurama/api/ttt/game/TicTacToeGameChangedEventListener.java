package dev.kurama.api.ttt.game;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicTacToeGameChangedEventListener {

  @NonNull
  private final TicTacToeGameChangedMessageSender sender;

  @Async
  @EventListener
  public void ticTacToeGameChangedEvent(@NonNull TicTacToeGameChangedEvent event) {
    sender.sendTicTacToeGameChangedMessage(event);
  }

}
