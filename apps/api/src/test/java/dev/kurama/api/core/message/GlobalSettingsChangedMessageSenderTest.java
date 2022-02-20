package dev.kurama.api.core.message;

import static dev.kurama.api.core.message.GlobalSettingsChangedMessageSender.GLOBAL_SETTINGS_CHANGED_CHANNEL;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class GlobalSettingsChangedMessageSenderTest {

  @InjectMocks
  private GlobalSettingsChangedMessageSender globalSettingsChangedMessageSender;

  @Mock
  private SimpMessagingTemplate template;

  @Test
  void should_send_global_settings_changed_message() {
    GlobalSettingsChangedEvent event = GlobalSettingsChangedEvent.builder().build();

    globalSettingsChangedMessageSender.sendGlobalSettingsChangedMessage(event);

    verify(template).convertAndSend(GLOBAL_SETTINGS_CHANGED_CHANNEL, event);
  }
}
