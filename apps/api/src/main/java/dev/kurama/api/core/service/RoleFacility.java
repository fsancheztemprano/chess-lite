package dev.kurama.api.core.service;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import javax.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RoleFacility {

  @NonNull
  private final UserService userService;

  @NonNull
  private final RoleService roleService;

  @NonNull
  private final GlobalSettingsService globalSettingsService;


  @Transactional
  public void deleteRole(String id) throws RoleNotFoundException, ImmutableRoleException {
    Role role = roleService.findRoleById(id)
      .orElseThrow(() -> new RoleNotFoundException(id));

    if (role.isCoreRole()) {
      throw new ImmutableRoleException(id);
    }

    Role defaultRole = globalSettingsService.getGlobalSettings()
      .getDefaultRole();

    userService.reassignToRole(role.getUsers(), defaultRole);

    roleService.delete(role);
  }

}
