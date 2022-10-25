package dev.kurama.api.core.mapper;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.hateoas.model.RoleModel;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

@Mapper(uses = {AuthorityMapper.class})
public interface RoleMapper {

  RoleModel roleToRoleModel(Role role);

  default Page<RoleModel> rolePageToRoleModelPage(Page<Role> roles) {
    return roles.map(this::roleToRoleModel);
  }

}
