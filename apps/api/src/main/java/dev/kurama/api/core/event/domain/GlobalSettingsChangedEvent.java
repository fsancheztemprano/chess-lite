package dev.kurama.api.core.event.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GlobalSettingsChangedEvent implements ApplicationEvent {

  @Builder.Default
  private GlobalSettingsChangedEventAction action = GlobalSettingsChangedEventAction.UPDATED;

  public enum GlobalSettingsChangedEventAction {
    UPDATED,
  }
}
