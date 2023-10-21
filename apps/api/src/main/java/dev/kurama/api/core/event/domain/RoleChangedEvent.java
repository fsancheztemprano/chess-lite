package dev.kurama.api.core.event.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleChangedEvent implements ApplicationEvent {

  private RoleChangedEventAction action;
  private String roleId;

  public enum RoleChangedEventAction {
    CREATED, UPDATED, DELETED,
  }

}
