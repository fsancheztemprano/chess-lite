package dev.kurama.api.auth.facade;

import dev.kurama.api.auth.api.assembler.RoleModelAssembler;
import dev.kurama.api.auth.api.domain.model.RoleModel;
import dev.kurama.api.auth.api.mapper.RoleMapper;
import dev.kurama.api.auth.service.RoleService;
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
    return roleModelAssembler.toModel(
      roleMapper.roleToRoleModel(
        roleService.findRoleById(roleId).orElseThrow()));
  }
}
