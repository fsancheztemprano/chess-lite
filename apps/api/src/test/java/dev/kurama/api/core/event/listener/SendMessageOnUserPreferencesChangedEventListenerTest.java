package dev.kurama.api.core.event.listener;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent;
import dev.kurama.api.core.message.UserPreferencesChangedMessageSender;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class SendMessageOnUserPreferencesChangedEventListenerTest {

  @InjectMocks
  private SendMessageOnUserPreferencesChangedEventListener sendMessageOnUserPreferencesChangedEventListener;

  @Mock
  private UserPreferencesChangedMessageSender userPreferencesChangedMessageSender;

  @Test
  void user_preferences_changed_event_should_send_user_preferences_changed_message() {
    UserPreferencesChangedEvent event = UserPreferencesChangedEvent.builder().userPreferencesId(randomUUID()).build();

    sendMessageOnUserPreferencesChangedEventListener.userPreferencesChangedEvent(event);

    verify(userPreferencesChangedMessageSender).sendUserPreferencesChangedMessage(event);
  }
}
