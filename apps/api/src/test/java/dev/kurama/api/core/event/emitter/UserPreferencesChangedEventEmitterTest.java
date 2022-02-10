package dev.kurama.api.core.event.emitter;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class UserPreferencesChangedEventEmitterTest {

  @InjectMocks
  private UserPreferencesChangedEventEmitter userPreferencesChangedEventEmitter;

  @Mock
  private ApplicationEventPublisher applicationEventPublisher;

  @Test
  void should_emit_user_preferences_updated_event() {
    UserPreferencesChangedEvent event = UserPreferencesChangedEvent.builder()
      .userPreferencesId(randomUUID())
      .build();

    userPreferencesChangedEventEmitter.emitUserPreferencesUpdatedEvent(event.getUserPreferencesId());

    verify(applicationEventPublisher).publishEvent(event);
  }
}
