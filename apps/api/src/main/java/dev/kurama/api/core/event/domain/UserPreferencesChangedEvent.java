package dev.kurama.api.core.event.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserPreferencesChangedEvent implements ApplicationEvent {

  @Builder.Default
  private UserPreferencesChangedEventAction action = UserPreferencesChangedEventAction.UPDATED;
  private String userPreferencesId;

  public enum UserPreferencesChangedEventAction {
    UPDATED,
  }

}
