package dev.kurama.api.core.event.listener;

import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent;
import dev.kurama.api.core.message.GlobalSettingsChangedMessageSender;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SendMessageOnGlobalSettingsChangedEventListener {

  @NonNull
  private final GlobalSettingsChangedMessageSender globalSettingsChangedMessageSender;

  @Async
  @EventListener
  public void globalSettingsChangedEvent(@NonNull GlobalSettingsChangedEvent event) {
    globalSettingsChangedMessageSender.sendGlobalSettingsChangedMessage(event);
  }

}
