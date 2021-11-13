package dev.kurama.api.core.message;

import static dev.kurama.api.core.message.UserChangedMessageSender.USERS_CHANGED_CHANNEL;
import static dev.kurama.api.core.message.UserChangedMessageSender.USER_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.UserChangedEvent;
import dev.kurama.api.core.event.domain.UserChangedEvent.UserChangedEventAction;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class UserChangedMessageSenderTest {

  @InjectMocks
  private UserChangedMessageSender userChangedMessageSender;

  @Mock
  private SimpMessagingTemplate template;

  @Test
  void should_send_user_changed_message() {
    UserChangedEvent event = UserChangedEvent.builder()
      .action(UserChangedEventAction.CREATED)
      .userId(randomUUID())
      .build();

    userChangedMessageSender.sendUserChangedMessage(event);

    verify(template).convertAndSend(format(USER_CHANGED_CHANNEL, event.getUserId()), event);
    verify(template).convertAndSend(USERS_CHANGED_CHANNEL, event);
  }
}
