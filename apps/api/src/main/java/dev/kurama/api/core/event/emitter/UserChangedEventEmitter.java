package dev.kurama.api.core.event.emitter;

import dev.kurama.api.core.event.domain.UserChangedEvent;
import dev.kurama.api.core.event.domain.UserChangedEvent.UserChangedEventAction;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UserChangedEventEmitter {

  @NonNull
  private final ApplicationEventPublisher applicationEventPublisher;

  public void emitUserChangedEvent(String userId, UserChangedEventAction action) {
    applicationEventPublisher.publishEvent(UserChangedEvent.builder().userId(userId).action(action).build());
  }

  public void emitUserCreatedEvent(String userId) {
    emitUserChangedEvent(userId, UserChangedEventAction.CREATED);
  }

  public void emitUserUpdatedEvent(String userId) {
    emitUserChangedEvent(userId, UserChangedEventAction.UPDATED);
  }

  public void emitUserDeletedEvent(String userId) {
    emitUserChangedEvent(userId, UserChangedEventAction.DELETED);
  }
}
