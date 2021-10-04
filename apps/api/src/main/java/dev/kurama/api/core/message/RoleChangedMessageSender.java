package dev.kurama.api.core.message;

import static java.lang.String.format;

import dev.kurama.api.core.event.domain.RoleChangedEvent;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleChangedMessageSender {

  @NonNull
  private final SimpMessagingTemplate template;

  public void sendRoleChangedMessage(@NonNull RoleChangedEvent event) {
    template.convertAndSend(format("/ami/role/%s", event.getRoleId()), event);
    template.convertAndSend("/ami/role", event);
  }

}
