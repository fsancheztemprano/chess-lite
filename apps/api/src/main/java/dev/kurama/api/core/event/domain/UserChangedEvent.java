package dev.kurama.api.core.event.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserChangedEvent implements ApplicationEvent {

  private String userId;

  private UserChangedEventAction action;

  public enum UserChangedEventAction {
    CREATED,
    UPDATED,
    DELETED,
  }

}
