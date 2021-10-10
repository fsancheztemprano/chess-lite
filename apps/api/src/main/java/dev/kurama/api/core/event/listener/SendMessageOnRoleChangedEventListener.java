package dev.kurama.api.core.event.listener;

import dev.kurama.api.core.event.domain.RoleChangedEvent;
import dev.kurama.api.core.message.RoleChangedMessageSender;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SendMessageOnRoleChangedEventListener {

  @NonNull
  private final RoleChangedMessageSender roleChangedMessageSender;

  @Async
  @EventListener
  public void roleChangedEvent(@NonNull RoleChangedEvent event) {
    roleChangedMessageSender.sendRoleChangedMessage(event);
  }

}
