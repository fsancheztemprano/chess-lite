package dev.kurama.api.core.service;

import static dev.kurama.api.core.domain.Theme.UNIQUE_ID;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.domain.Theme;
import dev.kurama.api.core.hateoas.input.ThemeUpdateInput;
import dev.kurama.api.core.repository.ThemeRepository;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class ThemeServiceTest {

  @InjectMocks
  private ThemeService themeService;

  @Mock
  private ThemeRepository themeRepository;

  @Test
  void should_get_theme() {
    Theme theme = Theme.builder().setRandomUUID().build();
    when(themeRepository.findById(UNIQUE_ID)).thenReturn(Optional.of(theme));

    Theme actual = themeService.getTheme();

    verify(themeRepository).findById(UNIQUE_ID);
    assertEquals(theme, actual);
  }

  @Nested
  class UpdateThemeTests {

    @Test
    void should_update_theme_signup_open() {
      Theme theme = Theme.builder().primaryColor(randomUUID()).build();
      ThemeUpdateInput input = ThemeUpdateInput.builder().primaryColor(randomUUID()).build();
      when(themeRepository.findById(UNIQUE_ID)).thenReturn(Optional.of(theme));
      when(themeRepository.saveAndFlush(theme)).thenReturn(theme);

      Theme actual = themeService.updateTheme(input);

      verify(themeRepository).saveAndFlush(theme);
      assertThat(actual).isNotNull();
      assertThat(actual.getPrimaryColor()).isEqualTo(input.getPrimaryColor());
    }
  }
}
