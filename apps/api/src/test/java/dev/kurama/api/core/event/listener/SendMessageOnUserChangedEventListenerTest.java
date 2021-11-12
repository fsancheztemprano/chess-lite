package dev.kurama.api.core.event.listener;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.UserChangedEvent;
import dev.kurama.api.core.event.domain.UserChangedEvent.UserChangedEventAction;
import dev.kurama.api.core.message.UserChangedMessageSender;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class SendMessageOnUserChangedEventListenerTest {

  @InjectMocks
  private SendMessageOnUserChangedEventListener sendMessageOnUserChangedEventListener;

  @Mock
  private UserChangedMessageSender userChangedMessageSender;

  @Test
  void user_changed_event_should_send_user_changed_message() {
    UserChangedEvent event = UserChangedEvent.builder()
      .action(UserChangedEventAction.CREATED)
      .userId(randomUUID())
      .build();

    sendMessageOnUserChangedEventListener.userChangedEvent(event);

    verify(userChangedMessageSender).sendUserChangedMessage(event);
  }
}
