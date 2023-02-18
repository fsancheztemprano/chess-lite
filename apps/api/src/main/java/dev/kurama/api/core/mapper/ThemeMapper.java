package dev.kurama.api.core.mapper;

import dev.kurama.api.core.domain.Theme;
import dev.kurama.api.core.hateoas.model.ThemeModel;
import org.mapstruct.Mapper;

@Mapper()
public interface ThemeMapper {

  ThemeModel themeToThemeModel(Theme theme);

}
