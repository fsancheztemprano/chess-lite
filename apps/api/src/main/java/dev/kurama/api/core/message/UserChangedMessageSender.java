package dev.kurama.api.core.message;

import static java.lang.String.format;

import dev.kurama.api.core.event.domain.UserChangedEvent;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserChangedMessageSender {

  @NonNull
  private final SimpMessagingTemplate template;

  public void sendUserChangedMessage(@NonNull UserChangedEvent event) {
    template.convertAndSend(format("/ami/user/%s", event.getUserId()), event);
    template.convertAndSend("/ami/user", event);
  }

}
