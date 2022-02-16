package dev.kurama.api.core.event.emitter;

import static dev.kurama.api.core.message.GlobalSettingsChangedMessageSender.GLOBAL_SETTINGS_CHANGED_CHANNEL;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent;
import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent.GlobalSettingsChangedEventAction;
import dev.kurama.api.support.TestChannelInterceptor;
import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.AbstractSubscribableChannel;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("integration-test")
@SpringBootTest
class GlobalSettingsChangedEventEmitterIT {

  @Autowired
  private GlobalSettingsChangedEventEmitter globalSettingsChangedEventEmitter;

  @Autowired
  @Qualifier("brokerChannel")
  private AbstractSubscribableChannel abstractSubscribableChannel;

  private TestChannelInterceptor testChannelInterceptor;

  @BeforeEach
  void setUp() {
    testChannelInterceptor = new TestChannelInterceptor();
    abstractSubscribableChannel.addInterceptor(testChannelInterceptor);
  }

  @Test
  void should_send_global_settings_changed_message() throws InterruptedException, IOException {
    globalSettingsChangedEventEmitter.emitGlobalSettingsUpdatedEvent();

    Message<?> message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    StompHeaderAccessor messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(GLOBAL_SETTINGS_CHANGED_CHANNEL);

    GlobalSettingsChangedEvent payload = new ObjectMapper().readValue((byte[]) message.getPayload(),
      GlobalSettingsChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("action", GlobalSettingsChangedEventAction.UPDATED);

    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNull();
  }
}
