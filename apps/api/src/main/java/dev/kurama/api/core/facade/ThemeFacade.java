package dev.kurama.api.core.facade;

import dev.kurama.api.core.hateoas.input.ThemeUpdateInput;
import dev.kurama.api.core.hateoas.model.ThemeModel;
import dev.kurama.api.core.mapper.ThemeMapper;
import dev.kurama.api.core.service.ThemeService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ThemeFacade {

  @NonNull
  private final ThemeService themeService;

  @NonNull
  private final ThemeMapper themeMapper;

  public ThemeModel getTheme() {
    return themeMapper.themeToThemeModel(themeService.getTheme());
  }

  public ThemeModel updateTheme(ThemeUpdateInput themeUpdateInput) {
    return themeMapper.themeToThemeModel(themeService.updateTheme(themeUpdateInput));
  }
}
