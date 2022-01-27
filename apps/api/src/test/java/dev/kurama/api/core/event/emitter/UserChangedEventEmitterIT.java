package dev.kurama.api.core.event.emitter;

import static dev.kurama.api.core.message.UserChangedMessageSender.USERS_CHANGED_CHANNEL;
import static dev.kurama.api.core.message.UserChangedMessageSender.USER_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.api.core.event.domain.UserChangedEvent;
import dev.kurama.api.core.event.domain.UserChangedEvent.UserChangedEventAction;
import dev.kurama.api.framework.TestChannelInterceptor;
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
class UserChangedEventEmitterIT {

  @Autowired
  private UserChangedEventEmitter userChangedEventEmitter;

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
  void should_send_user_changed_message() throws InterruptedException, IOException {
    String userId = randomUUID();
    userChangedEventEmitter.emitUserCreatedEvent(userId);

    Message<?> message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNotNull();

    StompHeaderAccessor messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(format(USER_CHANGED_CHANNEL, userId));

    UserChangedEvent payload = new ObjectMapper().readValue((byte[]) message.getPayload(), UserChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("userId", userId)
      .hasFieldOrPropertyWithValue("action", UserChangedEventAction.CREATED);

    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNotNull();

    messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(USERS_CHANGED_CHANNEL);

    payload = new ObjectMapper().readValue((byte[]) message.getPayload(), UserChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("userId", userId)
      .hasFieldOrPropertyWithValue("action", UserChangedEventAction.CREATED);

    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNull();
  }
}
