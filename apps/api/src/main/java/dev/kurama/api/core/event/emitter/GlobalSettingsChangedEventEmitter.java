package dev.kurama.api.core.event.emitter;

import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent;
import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent.GlobalSettingsChangedEventAction;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class GlobalSettingsChangedEventEmitter {

  @NonNull
  private final ApplicationEventPublisher applicationEventPublisher;

  public void emitGlobalSettingsChangedEvent(GlobalSettingsChangedEventAction action) {
    applicationEventPublisher.publishEvent(
      GlobalSettingsChangedEvent.builder()
        .action(action)
        .build());
  }

  public void emitGlobalSettingsUpdatedEvent() {
    emitGlobalSettingsChangedEvent(GlobalSettingsChangedEventAction.UPDATED);
  }
}
