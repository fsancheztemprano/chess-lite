package dev.kurama.api.core.message;

import static dev.kurama.api.core.constant.WebsocketConstant.ROOT_WEBSOCKET_CHANNEL;

import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GlobalSettingsChangedMessageSender {

  public static final String GLOBAL_SETTINGS_CHANGED_CHANNEL = ROOT_WEBSOCKET_CHANNEL + "/global-settings";

  @NonNull
  private final SimpMessagingTemplate template;

  public void sendGlobalSettingsChangedMessage(@NonNull GlobalSettingsChangedEvent event) {
    template.convertAndSend(GLOBAL_SETTINGS_CHANGED_CHANNEL, event);
  }

}
