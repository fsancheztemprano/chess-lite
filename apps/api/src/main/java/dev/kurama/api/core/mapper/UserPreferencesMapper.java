package dev.kurama.api.core.mapper;

import dev.kurama.api.core.domain.UserPreferences;
import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import org.mapstruct.Mapper;

@Mapper()
public interface UserPreferencesMapper {

  UserPreferencesModel userPreferencesToUserPreferencesModel(UserPreferences userPreferences);

}
