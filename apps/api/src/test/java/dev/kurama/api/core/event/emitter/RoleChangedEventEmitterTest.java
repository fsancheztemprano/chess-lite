package dev.kurama.api.core.event.emitter;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.event.domain.RoleChangedEvent;
import dev.kurama.api.core.event.domain.RoleChangedEvent.RoleChangedEventAction;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class RoleChangedEventEmitterTest {

  @InjectMocks
  private RoleChangedEventEmitter roleChangedEventEmitter;

  @Mock
  private ApplicationEventPublisher applicationEventPublisher;

  @Test
  void should_emit_role_created_event() {
    RoleChangedEvent event = RoleChangedEvent.builder()
      .roleId(randomUUID())
      .action(RoleChangedEventAction.CREATED)
      .build();

    roleChangedEventEmitter.emitRoleCreatedEvent(event.getRoleId());

    verify(applicationEventPublisher).publishEvent(event);
  }

  @Test
  void should_emit_role_updated_event() {
    RoleChangedEvent event = RoleChangedEvent.builder()
      .roleId(randomUUID())
      .action(RoleChangedEventAction.UPDATED)
      .build();

    roleChangedEventEmitter.emitRoleUpdatedEvent(event.getRoleId());

    verify(applicationEventPublisher).publishEvent(event);
  }

  @Test
  void should_emit_role_deleted_event() {
    RoleChangedEvent event = RoleChangedEvent.builder()
      .roleId(randomUUID())
      .action(RoleChangedEventAction.DELETED)
      .build();

    roleChangedEventEmitter.emitRoleDeletedEvent(event.getRoleId());

    verify(applicationEventPublisher).publishEvent(event);
  }
}
