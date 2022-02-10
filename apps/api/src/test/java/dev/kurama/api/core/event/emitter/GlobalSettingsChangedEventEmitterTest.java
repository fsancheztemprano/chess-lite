package dev.kurama.api.core.event.emitter;

import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class GlobalSettingsChangedEventEmitterTest {

  @InjectMocks
  private GlobalSettingsChangedEventEmitter globalSettingsChangedEventEmitter;

  @Mock
  private ApplicationEventPublisher applicationEventPublisher;

  @Test
  void should_emit_global_settings_updated_event() {
    GlobalSettingsChangedEvent event = GlobalSettingsChangedEvent.builder()
      .build();

    globalSettingsChangedEventEmitter.emitGlobalSettingsUpdatedEvent();

    verify(applicationEventPublisher).publishEvent(event);
  }
}
