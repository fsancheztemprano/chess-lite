package dev.kurama.api.core.service;

import static dev.kurama.api.core.domain.Theme.UNIQUE_ID;

import dev.kurama.api.core.domain.Theme;
import dev.kurama.api.core.hateoas.input.ThemeUpdateInput;
import dev.kurama.api.core.repository.ThemeRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ThemeService {

  @NonNull
  private final ThemeRepository themeRepository;

  public Theme getTheme() {
    return themeRepository.findById(UNIQUE_ID).orElseGet(this::createTheme);
  }

  public Theme updateTheme(ThemeUpdateInput themeUpdateInput) {
    var theme = getTheme();

    theme.setPrimaryColor(themeUpdateInput.getPrimaryColor());
    theme.setAccentColor(themeUpdateInput.getAccentColor());
    theme.setWarnColor(themeUpdateInput.getWarnColor());

    return themeRepository.saveAndFlush(theme);
  }

  private Theme createTheme() {
    return this.themeRepository.saveAndFlush(Theme.builder().id(UNIQUE_ID).build());
  }
}
