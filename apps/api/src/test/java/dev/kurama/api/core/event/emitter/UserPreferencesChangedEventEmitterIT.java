package dev.kurama.api.core.event.emitter;

import static dev.kurama.api.core.message.UserPreferencesChangedMessageSender.USERS_PREFERENCES_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent;
import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent.UserPreferencesChangedEventAction;
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


@SpringBootTest
class UserPreferencesChangedEventEmitterIT {

  @Autowired
  private UserPreferencesChangedEventEmitter userPreferencesChangedEventEmitter;

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
  void should_send_user_preferences_changed_message() throws InterruptedException, IOException {
    String userPreferencesId = randomUUID();
    userPreferencesChangedEventEmitter.emitUserPreferencesUpdatedEvent(userPreferencesId);

    Message<?> message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    StompHeaderAccessor messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(format(USERS_PREFERENCES_CHANGED_CHANNEL, userPreferencesId));

    UserPreferencesChangedEvent payload = new ObjectMapper().readValue((byte[]) message.getPayload(),
      UserPreferencesChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("userPreferencesId", userPreferencesId)
      .hasFieldOrPropertyWithValue("action", UserPreferencesChangedEventAction.UPDATED);

    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNull();
  }
}
