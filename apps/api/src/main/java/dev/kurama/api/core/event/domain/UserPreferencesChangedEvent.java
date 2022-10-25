package dev.kurama.api.core.event.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserPreferencesChangedEvent implements ApplicationEvent {

  private String userPreferencesId;

  @Builder.Default
  private UserPreferencesChangedEventAction action = UserPreferencesChangedEventAction.UPDATED;

  public enum UserPreferencesChangedEventAction {
    UPDATED,
  }

}
