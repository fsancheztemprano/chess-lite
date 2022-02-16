package dev.kurama.api.core.event.listener;

import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent;
import dev.kurama.api.core.message.GlobalSettingsChangedMessageSender;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class SendMessageOnGlobalSettingsChangedEventListenerTest {

  @InjectMocks
  private SendMessageOnGlobalSettingsChangedEventListener sendMessageOnGlobalSettingsChangedEventListener;

  @Mock
  private GlobalSettingsChangedMessageSender globalSettingsChangedMessageSender;

  @Test
  void global_settings_changed_event_should_send_global_settings_changed_message() {
    GlobalSettingsChangedEvent event = GlobalSettingsChangedEvent.builder()
      .build();

    sendMessageOnGlobalSettingsChangedEventListener.globalSettingsChangedEvent(event);

    verify(globalSettingsChangedMessageSender).sendGlobalSettingsChangedMessage(event);
  }
}
