package dev.kurama.api.core.event.emitter;

import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent;
import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent.UserPreferencesChangedEventAction;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UserPreferencesChangedEventEmitter {

  @NonNull
  private final ApplicationEventPublisher applicationEventPublisher;

  public void emitUserPreferencesChangedEvent(String userPreferencesId, UserPreferencesChangedEventAction action) {
    applicationEventPublisher.publishEvent(
      UserPreferencesChangedEvent.builder()
        .userPreferencesId(userPreferencesId)
        .action(action)
        .build());
  }

  public void emitUserPreferencesUpdatedEvent(String userPreferencesId) {
    emitUserPreferencesChangedEvent(userPreferencesId, UserPreferencesChangedEventAction.UPDATED);
  }
}
