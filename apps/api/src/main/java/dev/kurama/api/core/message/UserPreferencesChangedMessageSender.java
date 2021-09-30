package dev.kurama.api.core.message;

import static java.lang.String.format;

import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserPreferencesChangedMessageSender {

  @NonNull
  private final SimpMessagingTemplate template;

  public void sendUserPreferencesChangedMessage(@NonNull UserPreferencesChangedEvent event) {
    template.convertAndSend(format("/ami/user-preferences/%s", event.getUserPreferencesId()), event);
  }

}
