package dev.kurama.api.core.facade;

import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.assembler.RoleModelAssembler;
import dev.kurama.api.core.hateoas.input.RoleUpdateInput;
import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.mapper.RoleMapper;
import dev.kurama.api.core.service.RoleFacility;
import dev.kurama.api.core.service.RoleService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedModel;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleFacade {

  @NonNull
  private final RoleService roleService;

  @NonNull
  private final RoleFacility roleFacility;

  @NonNull
  private final RoleMapper roleMapper;

  @NonNull
  private final RoleModelAssembler roleModelAssembler;

  public PagedModel<RoleModel> getAll(Pageable pageable, String search) {
    return roleModelAssembler.toPagedModel(
      roleMapper.rolePageToRoleModelPage(roleService.getAllRoles(pageable, search)));
  }

  public RoleModel findByRoleId(String roleId) throws RoleNotFoundException {
    return roleMapper.roleToRoleModel(
      roleService.findRoleById(roleId).orElseThrow(() -> new RoleNotFoundException(roleId)));
  }

  public RoleModel create(@Length(min = 3, max = 128) String roleName) throws RoleExistsException {
    return roleMapper.roleToRoleModel(roleService.create(roleName));
  }

  public RoleModel update(String roleId, RoleUpdateInput roleUpdateInput)
    throws RoleNotFoundException, ImmutableRoleException {
    return roleMapper.roleToRoleModel(roleService.update(roleId, roleUpdateInput));
  }

  public void delete(String id) throws ImmutableRoleException, RoleNotFoundException {
    roleFacility.deleteRole(id);
  }
}
