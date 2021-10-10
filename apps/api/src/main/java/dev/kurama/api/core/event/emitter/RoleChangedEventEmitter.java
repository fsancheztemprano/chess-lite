package dev.kurama.api.core.event.emitter;

import dev.kurama.api.core.event.domain.RoleChangedEvent;
import dev.kurama.api.core.event.domain.RoleChangedEvent.RoleChangedEventAction;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class RoleChangedEventEmitter {

  @NonNull
  private final ApplicationEventPublisher applicationEventPublisher;

  public void emitRoleChangedEvent(String roleId, RoleChangedEventAction action) {
    applicationEventPublisher.publishEvent(
      RoleChangedEvent.builder()
        .roleId(roleId)
        .action(action)
        .build());
  }

  public void emitRoleCreatedEvent(String roleId) {
    emitRoleChangedEvent(roleId, RoleChangedEventAction.CREATED);

  }

  public void emitRoleUpdatedEvent(String roleId) {
    emitRoleChangedEvent(roleId, RoleChangedEventAction.UPDATED);

  }

  public void emitRoleDeletedEvent(String roleId) {
    emitRoleChangedEvent(roleId, RoleChangedEventAction.DELETED);

  }
}
