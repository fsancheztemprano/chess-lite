package dev.kurama.api.core.message;

import static dev.kurama.api.core.constant.WebsocketConstant.ROOT_WEBSOCKET_CHANNEL;
import static java.lang.String.format;

import dev.kurama.api.core.event.domain.UserChangedEvent;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserChangedMessageSender {

  public static final String USERS_CHANGED_CHANNEL = ROOT_WEBSOCKET_CHANNEL + "/user";
  public static final String USER_CHANGED_CHANNEL = USERS_CHANGED_CHANNEL + "/%s";

  @NonNull
  private final SimpMessagingTemplate template;

  public void sendUserChangedMessage(@NonNull UserChangedEvent event) {
    template.convertAndSend(format(USER_CHANGED_CHANNEL, event.getUserId()), event);
    template.convertAndSend(USERS_CHANGED_CHANNEL, event);
  }

}
