package dev.kurama.api.core.event.emitter;

import dev.kurama.api.core.domain.User;
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

  public void emitUserChangedEvent(User user, UserChangedEventAction action) {
    applicationEventPublisher.publishEvent(
      UserChangedEvent.builder().userId(user.getId()).username(user.getUsername()).action(action).build());
  }

  public void emitUserCreatedEvent(User user) {
    emitUserChangedEvent(user, UserChangedEventAction.CREATED);
  }

  public void emitUserUpdatedEvent(User user) {
    emitUserChangedEvent(user, UserChangedEventAction.UPDATED);
  }

  public void emitUserDeletedEvent(User user) {
    emitUserChangedEvent(user, UserChangedEventAction.DELETED);
  }
}
