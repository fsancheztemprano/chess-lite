package dev.kurama.api.core.event.emitter;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.UserChangedEvent;
import dev.kurama.api.core.event.domain.UserChangedEvent.UserChangedEventAction;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class UserChangedEventEmitterTest {

  @InjectMocks
  private UserChangedEventEmitter userChangedEventEmitter;

  @Mock
  private ApplicationEventPublisher applicationEventPublisher;

  @Test
  void should_emit_user_created_event() {
    UserChangedEvent event = UserChangedEvent.builder()
      .userId(randomUUID())
      .action(UserChangedEventAction.CREATED)
      .build();

    userChangedEventEmitter.emitUserCreatedEvent(event.getUserId());

    verify(applicationEventPublisher).publishEvent(event);
  }

  @Test
  void should_emit_user_updated_event() {
    UserChangedEvent event = UserChangedEvent.builder()
      .userId(randomUUID())
      .action(UserChangedEventAction.UPDATED)
      .build();

    userChangedEventEmitter.emitUserUpdatedEvent(event.getUserId());

    verify(applicationEventPublisher).publishEvent(event);
  }

  @Test
  void should_emit_user_deleted_event() {
    UserChangedEvent event = UserChangedEvent.builder()
      .userId(randomUUID())
      .action(UserChangedEventAction.DELETED)
      .build();

    userChangedEventEmitter.emitUserDeletedEvent(event.getUserId());

    verify(applicationEventPublisher).publishEvent(event);
  }
}
