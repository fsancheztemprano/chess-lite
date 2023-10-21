package dev.kurama.api.core.event.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserChangedEvent implements ApplicationEvent {

  private UserChangedEventAction action;
  private String userId;
  private String username;


  public enum UserChangedEventAction {
    CREATED, UPDATED, DELETED,
  }

}
