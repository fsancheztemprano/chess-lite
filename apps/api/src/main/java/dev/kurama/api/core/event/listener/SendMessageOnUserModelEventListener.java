package dev.kurama.api.core.event.listener;

import dev.kurama.api.core.event.domain.UserModelEvent;
import dev.kurama.api.core.message.UserModelMessageSender;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SendMessageOnUserModelEventListener {

  @NonNull
  private final UserModelMessageSender userModelMessageSender;

  @Async
  @EventListener
  public void userModelEvent(@NonNull UserModelEvent event) {
    userModelMessageSender.sendUserModelMessage(event);
  }

}
