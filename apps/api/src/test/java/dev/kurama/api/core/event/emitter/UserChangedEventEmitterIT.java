package dev.kurama.api.core.event.emitter;

import static dev.kurama.api.core.message.UserChangedMessageSender.USERS_CHANGED_CHANNEL;
import static dev.kurama.api.core.message.UserChangedMessageSender.USER_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.event.domain.UserChangedEvent;
import dev.kurama.api.core.event.domain.UserChangedEvent.UserChangedEventAction;
import dev.kurama.api.ttt.player.TicTacToePlayerEventListener;
import dev.kurama.support.TestChannelInterceptor;
import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.AbstractSubscribableChannel;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles(value = "integration-test")
@SpringBootTest
class UserChangedEventEmitterIT {

  @Autowired
  private UserChangedEventEmitter userChangedEventEmitter;

  @Autowired
  @Qualifier("brokerChannel")
  private AbstractSubscribableChannel abstractSubscribableChannel;

  @MockBean
  private TicTacToePlayerEventListener ticTacToePlayerEventListener;

  private TestChannelInterceptor testChannelInterceptor;

  @BeforeEach
  void setUp() {
    testChannelInterceptor = new TestChannelInterceptor();
    abstractSubscribableChannel.addInterceptor(testChannelInterceptor);
  }

  @Test
  void should_send_user_created_message() throws InterruptedException, IOException {
    User user = User.builder().setRandomUUID().username(randomUUID()).build();
    userChangedEventEmitter.emitUserCreatedEvent(user);

    Message<?> message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    StompHeaderAccessor messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(format(USER_CHANGED_CHANNEL, user.getId()));

    UserChangedEvent payload = new ObjectMapper().readValue((byte[]) message.getPayload(), UserChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("userId", user.getId())
      .hasFieldOrPropertyWithValue("username", user.getUsername())
      .hasFieldOrPropertyWithValue("action", UserChangedEventAction.CREATED);

    message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(USERS_CHANGED_CHANNEL);

    payload = new ObjectMapper().readValue((byte[]) message.getPayload(), UserChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("userId", user.getId())
      .hasFieldOrPropertyWithValue("username", user.getUsername())
      .hasFieldOrPropertyWithValue("action", UserChangedEventAction.CREATED);

    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNull();
  }

  @Test
  void should_send_user_updated_message() throws InterruptedException, IOException {
    User user = User.builder().setRandomUUID().username(randomUUID()).build();
    userChangedEventEmitter.emitUserUpdatedEvent(user);

    Message<?> message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    StompHeaderAccessor messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(format(USER_CHANGED_CHANNEL, user.getId()));

    UserChangedEvent payload = new ObjectMapper().readValue((byte[]) message.getPayload(), UserChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("userId", user.getId())
      .hasFieldOrPropertyWithValue("username", user.getUsername())
      .hasFieldOrPropertyWithValue("action", UserChangedEventAction.UPDATED);

    message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(USERS_CHANGED_CHANNEL);

    payload = new ObjectMapper().readValue((byte[]) message.getPayload(), UserChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("userId", user.getId())
      .hasFieldOrPropertyWithValue("username", user.getUsername())
      .hasFieldOrPropertyWithValue("action", UserChangedEventAction.UPDATED);

    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNull();
  }

  @Test
  void should_send_user_deleted_message() throws InterruptedException, IOException {
    User user = User.builder().setRandomUUID().username(randomUUID()).build();
    userChangedEventEmitter.emitUserDeletedEvent(user);

    Message<?> message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    StompHeaderAccessor messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(format(USER_CHANGED_CHANNEL, user.getId()));

    UserChangedEvent payload = new ObjectMapper().readValue((byte[]) message.getPayload(), UserChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("userId", user.getId())
      .hasFieldOrPropertyWithValue("username", user.getUsername())
      .hasFieldOrPropertyWithValue("action", UserChangedEventAction.DELETED);

    message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(USERS_CHANGED_CHANNEL);

    payload = new ObjectMapper().readValue((byte[]) message.getPayload(), UserChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("userId", user.getId())
      .hasFieldOrPropertyWithValue("username", user.getUsername())
      .hasFieldOrPropertyWithValue("action", UserChangedEventAction.DELETED);

    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNull();
  }
}
