package dev.kurama.api.core.event.emitter;

import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class GlobalSettingsChangedEventEmitter {

  @NonNull
  private final ApplicationEventPublisher applicationEventPublisher;

  public void emitGlobalSettingsChangedEvent() {
    applicationEventPublisher.publishEvent(
      GlobalSettingsChangedEvent.builder().build());
  }

  public void emitGlobalSettingsUpdatedEvent() {
    emitGlobalSettingsChangedEvent();
  }
}
