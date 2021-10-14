package dev.kurama.api.core.mapper;

import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.hateoas.model.GlobalSettingsModel;
import dev.kurama.api.core.hateoas.model.RoleModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper()
public interface GlobalSettingsMapper {

  GlobalSettingsModel globalSettingsToGlobalSettingsModel(GlobalSettings globalSettings);

  @Mapping(target = "authorities", ignore = true)
  RoleModel roleToRoleModel(Role role);

}
