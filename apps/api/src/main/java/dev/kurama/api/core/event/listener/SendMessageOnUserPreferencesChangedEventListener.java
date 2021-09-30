package dev.kurama.api.core.event.listener;

import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent;
import dev.kurama.api.core.message.UserPreferencesChangedMessageSender;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SendMessageOnUserPreferencesChangedEventListener {

  @NonNull
  private final UserPreferencesChangedMessageSender userPreferencesChangedMessageSender;

  @Async
  @EventListener
  public void userPreferencesChangedEvent(@NonNull UserPreferencesChangedEvent event) {
    userPreferencesChangedMessageSender.sendUserPreferencesChangedMessage(event);
  }

}
