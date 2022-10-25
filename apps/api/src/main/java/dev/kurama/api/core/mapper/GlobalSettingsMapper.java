package dev.kurama.api.core.mapper;

import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.hateoas.model.GlobalSettingsModel;
import org.mapstruct.Mapper;

@Mapper(uses = {RoleMapper.class})
public interface GlobalSettingsMapper {

  GlobalSettingsModel globalSettingsToGlobalSettingsModel(GlobalSettings globalSettings);

}
