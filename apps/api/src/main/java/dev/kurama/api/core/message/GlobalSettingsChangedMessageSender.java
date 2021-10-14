package dev.kurama.api.core.message;

import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GlobalSettingsChangedMessageSender {

  @NonNull
  private final SimpMessagingTemplate template;

  public void sendGlobalSettingsChangedMessage(@NonNull GlobalSettingsChangedEvent event) {
    template.convertAndSend("/ami/global-settings", event);
  }

}
