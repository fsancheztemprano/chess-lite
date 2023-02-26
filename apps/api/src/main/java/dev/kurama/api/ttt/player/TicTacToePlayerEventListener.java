package dev.kurama.api.ttt.player;

import dev.kurama.api.core.event.domain.UserChangedEvent;
import dev.kurama.api.core.event.domain.UserChangedEvent.UserChangedEventAction;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicTacToePlayerEventListener {


  @NonNull
  private final TicTacToePlayerService ticTacToePlayerService;

  @Async
  @EventListener
  public void userChangedEvent(@NonNull UserChangedEvent event) {
    if (event.getAction() != UserChangedEventAction.CREATED) {
      return;
    }
    if (ticTacToePlayerService.existsById(event.getUserId())) {
      return;
    }
    ticTacToePlayerService.create(event.getUserId());
  }

}
