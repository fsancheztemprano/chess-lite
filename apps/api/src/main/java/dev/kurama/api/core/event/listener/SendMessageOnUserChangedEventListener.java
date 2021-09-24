package dev.kurama.api.core.event.listener;

import dev.kurama.api.core.event.domain.UserChangedEvent;
import dev.kurama.api.core.message.UserChangedMessageSender;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SendMessageOnUserChangedEventListener {

  @NonNull
  private final UserChangedMessageSender userChangedMessageSender;

  @Async
  @EventListener
  public void userChangedEvent(@NonNull UserChangedEvent event) {
    userChangedMessageSender.sendUserChangedMessage(event);
  }

}
