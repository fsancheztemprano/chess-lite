package dev.kurama.api.core.event.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleChangedEvent implements ApplicationEvent {

  private String roleId;

  private RoleChangedEventAction action;

  public enum RoleChangedEventAction {
    CREATED,
    UPDATED,
    DELETED,
  }

}
