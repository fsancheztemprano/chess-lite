package dev.kurama.api.core.event.listener;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.RoleChangedEvent;
import dev.kurama.api.core.event.domain.RoleChangedEvent.RoleChangedEventAction;
import dev.kurama.api.core.message.RoleChangedMessageSender;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class SendMessageOnRoleChangedEventListenerTest {

  @InjectMocks
  private SendMessageOnRoleChangedEventListener sendMessageOnRoleChangedEventListener;

  @Mock
  private RoleChangedMessageSender roleChangedMessageSender;

  @Test
  void role_changed_event_should_send_role_changed_message() {
    RoleChangedEvent event = RoleChangedEvent.builder()
      .action(RoleChangedEventAction.CREATED)
      .roleId(randomUUID())
      .build();

    sendMessageOnRoleChangedEventListener.roleChangedEvent(event);

    verify(roleChangedMessageSender).sendRoleChangedMessage(event);
  }

}
