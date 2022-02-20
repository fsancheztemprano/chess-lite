package dev.kurama.api.core.event.emitter;

import static dev.kurama.api.core.message.RoleChangedMessageSender.ROLES_CHANGED_CHANNEL;
import static dev.kurama.api.core.message.RoleChangedMessageSender.ROLE_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.api.core.event.domain.RoleChangedEvent;
import dev.kurama.api.core.event.domain.RoleChangedEvent.RoleChangedEventAction;
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
class RoleChangedEventEmitterIT {

  @Autowired
  private RoleChangedEventEmitter roleChangedEventEmitter;

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
  void should_send_role_changed_message() throws InterruptedException, IOException {
    String roleId = randomUUID();
    roleChangedEventEmitter.emitRoleCreatedEvent(roleId);

    Message<?> message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    StompHeaderAccessor messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(format(ROLE_CHANGED_CHANNEL, roleId));

    RoleChangedEvent payload = new ObjectMapper().readValue((byte[]) message.getPayload(), RoleChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("roleId", roleId)
      .hasFieldOrPropertyWithValue("action", RoleChangedEventAction.CREATED);

    message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(ROLES_CHANGED_CHANNEL);

    payload = new ObjectMapper().readValue((byte[]) message.getPayload(), RoleChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("roleId", roleId)
      .hasFieldOrPropertyWithValue("action", RoleChangedEventAction.CREATED);

    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNull();
  }
}
