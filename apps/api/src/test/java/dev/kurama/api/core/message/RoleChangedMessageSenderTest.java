package dev.kurama.api.core.message;

import static dev.kurama.api.core.message.RoleChangedMessageSender.ROLES_CHANGED_CHANNEL;
import static dev.kurama.api.core.message.RoleChangedMessageSender.ROLE_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.RoleChangedEvent;
import dev.kurama.api.core.event.domain.RoleChangedEvent.RoleChangedEventAction;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class RoleChangedMessageSenderTest {

  @InjectMocks
  private RoleChangedMessageSender roleChangedMessageSender;

  @Mock
  private SimpMessagingTemplate template;

  @Test
  void should_send_role_changed_message() {
    RoleChangedEvent event = RoleChangedEvent.builder()
      .action(RoleChangedEventAction.CREATED)
      .roleId(randomUUID())
      .build();

    roleChangedMessageSender.sendRoleChangedMessage(event);

    verify(template).convertAndSend(format(ROLE_CHANGED_CHANNEL, event.getRoleId()), event);
    verify(template).convertAndSend(ROLES_CHANGED_CHANNEL, event);
  }
}
