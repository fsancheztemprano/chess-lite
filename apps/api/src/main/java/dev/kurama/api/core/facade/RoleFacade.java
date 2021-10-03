package dev.kurama.api.core.facade;

import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.assembler.RoleModelAssembler;
import dev.kurama.api.core.hateoas.input.RoleInput;
import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.mapper.RoleMapper;
import dev.kurama.api.core.service.RoleService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedModel;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleFacade {

  @NonNull
  private final RoleService roleService;

  @NonNull
  private final RoleMapper roleMapper;

  @NonNull
  private final RoleModelAssembler roleModelAssembler;


  public PagedModel<RoleModel> getAll(Pageable pageable) {
    return roleModelAssembler.toPagedModel(
      roleMapper.rolePageToRoleModelPage(
        roleService.getAllRoles(pageable)));
  }

  public RoleModel findByRoleId(String roleId) {
    return roleMapper.roleToRoleModel(roleService.findRoleById(roleId).orElseThrow());
  }

  public RoleModel create(RoleInput roleInput) throws RoleExistsException {
    return roleMapper.roleToRoleModel(roleService.create(roleInput));
  }

  public RoleModel update(String roleId, RoleInput roleInput) throws RoleNotFoundException, ImmutableRoleException {
    return roleMapper.roleToRoleModel(roleService.update(roleId, roleInput));
  }

  public void delete(String id) throws ImmutableRoleException, RoleNotFoundException {
    roleService.delete(id);
  }
}
