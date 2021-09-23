package dev.kurama.api.core.event.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserModelEvent implements ApplicationEvent {

  private String userId;

  private UserModelEventAction action;

  public enum UserModelEventAction {
    CREATED,
    UPDATED,
    DELETED,
  }

}
