package dev.kurama.api.core.service;

import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static com.google.common.collect.Sets.newHashSet;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoleFacilityTest {

  @InjectMocks
  private RoleFacility facility;

  @Mock
  private RoleService roleService;

  @Mock
  private UserService userService;

  @Mock
  private GlobalSettingsService globalSettingsService;

  @Nested
  class DeleteRoleTests {

    @Test
    void should_delete_role_by_id() throws ImmutableRoleException, RoleNotFoundException {
      Role expected = Role.builder()
        .setRandomUUID()
        .users(newHashSet())
        .build();
      when(roleService.findRoleById(expected.getId())).thenReturn(Optional.of(expected));
      Role defaultRole = Role.builder()
        .setRandomUUID()
        .build();
      when(globalSettingsService.getGlobalSettings()).thenReturn(
        GlobalSettings.builder()
          .defaultRole(defaultRole)
          .build());

      facility.deleteRole(expected.getId());

      verify(roleService).findRoleById(expected.getId());
      verify(globalSettingsService).getGlobalSettings();
      verify(userService).reassignToRole(expected.getUsers(), defaultRole);
      verify(roleService).delete(expected);
    }

    @Test
    void should_throw_if_role_is_core_role() {
      Role expected = Role.builder()
        .setRandomUUID()
        .coreRole(true)
        .build();
      when(roleService.findRoleById(expected.getId())).thenReturn(Optional.of(expected));

      assertThrows(ImmutableRoleException.class, () -> facility.deleteRole(expected.getId()));
    }
  }
}
