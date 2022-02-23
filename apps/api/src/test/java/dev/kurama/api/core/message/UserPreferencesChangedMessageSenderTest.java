package dev.kurama.api.core.message;

import static dev.kurama.api.core.message.UserPreferencesChangedMessageSender.USERS_PREFERENCES_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class UserPreferencesChangedMessageSenderTest {

  @InjectMocks
  private UserPreferencesChangedMessageSender userPreferencesChangedMessageSender;

  @Mock
  private SimpMessagingTemplate template;

  @Test
  void should_send_user_preferences_changed_message() {
    UserPreferencesChangedEvent event = UserPreferencesChangedEvent.builder().userPreferencesId(randomUUID()).build();

    userPreferencesChangedMessageSender.sendUserPreferencesChangedMessage(event);

    verify(template).convertAndSend(format(USERS_PREFERENCES_CHANGED_CHANNEL, event.getUserPreferencesId()), event);
  }
}
