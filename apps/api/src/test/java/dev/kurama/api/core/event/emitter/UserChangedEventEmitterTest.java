package dev.kurama.api.core.event.emitter;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.domain.User;
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
    User user = User.builder().setRandomUUID().username(randomUUID()).build();

    userChangedEventEmitter.emitUserCreatedEvent(user);

    verify(applicationEventPublisher).publishEvent(UserChangedEvent.builder()
      .userId(user.getId())
      .username(user.getUsername())
      .action(UserChangedEventAction.CREATED)
      .build());
  }

  @Test
  void should_emit_user_updated_event() {
    User user = User.builder().setRandomUUID().username(randomUUID()).build();

    userChangedEventEmitter.emitUserUpdatedEvent(user);

    verify(applicationEventPublisher).publishEvent(UserChangedEvent.builder()
      .userId(user.getId())
      .username(user.getUsername())
      .action(UserChangedEventAction.UPDATED)
      .build());
  }

  @Test
  void should_emit_user_deleted_event() {
    User user = User.builder().setRandomUUID().username(randomUUID()).build();

    userChangedEventEmitter.emitUserDeletedEvent(user);

    verify(applicationEventPublisher).publishEvent(UserChangedEvent.builder()
      .userId(user.getId())
      .username(user.getUsername())
      .action(UserChangedEventAction.DELETED)
      .build());
  }
}
