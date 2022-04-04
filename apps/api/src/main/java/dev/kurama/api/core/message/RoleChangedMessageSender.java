package dev.kurama.api.core.message;

import static dev.kurama.api.core.constant.WebsocketConstant.ROOT_WEBSOCKET_CHANNEL;
import static java.lang.String.format;

import dev.kurama.api.core.event.domain.RoleChangedEvent;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleChangedMessageSender {

  public static final String ROLES_CHANGED_CHANNEL = ROOT_WEBSOCKET_CHANNEL + "/role";
  public static final String ROLE_CHANGED_CHANNEL = ROLES_CHANGED_CHANNEL + "/%s";

  @NonNull
  private final SimpMessagingTemplate template;

  public void sendRoleChangedMessage(@NonNull RoleChangedEvent event) {
    template.convertAndSend(format(ROLE_CHANGED_CHANNEL, event.getRoleId()), event);
    template.convertAndSend(ROLES_CHANGED_CHANNEL, event);
  }

}
