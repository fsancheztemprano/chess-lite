package dev.kurama.api.auth.api.mapper;

import dev.kurama.api.auth.api.domain.model.RoleModel;
import dev.kurama.api.auth.domain.Role;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

@Mapper
public interface RoleMapper {

  RoleModel roleToRoleModel(Role role);

  default String roleToString(Role role) {
    return role.getName();
  }

  default Page<RoleModel> rolePageToRoleModelPage(Page<Role> roles) {
    return roles.map(this::roleToRoleModel);
  }

}
