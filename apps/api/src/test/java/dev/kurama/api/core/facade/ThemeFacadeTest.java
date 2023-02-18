package dev.kurama.api.core.facade;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.domain.Theme;
import dev.kurama.api.core.hateoas.input.ThemeUpdateInput;
import dev.kurama.api.core.hateoas.model.ThemeModel;
import dev.kurama.api.core.mapper.ThemeMapper;
import dev.kurama.api.core.service.ThemeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class ThemeFacadeTest {

  @InjectMocks
  private ThemeFacade themeFacade;

  @Mock
  private ThemeService themeService;

  @Mock
  private ThemeMapper themeMapper;

  @Test
  void should_get_theme_from_service() {
    Theme theme = Theme.builder().primaryColor(randomUUID()).build();
    ThemeModel expected = ThemeModel.builder().build();
    when(themeService.getTheme()).thenReturn(theme);
    when(themeMapper.themeToThemeModel(theme)).thenReturn(expected);

    ThemeModel actual = themeFacade.getTheme();

    verify(themeService).getTheme();
    verify(themeMapper).themeToThemeModel(theme);
    assertThat(actual).isNotNull().isEqualTo(expected);
  }

  @Test
  void should_update_theme_from_service() {
    ThemeUpdateInput themeUpdateInput = ThemeUpdateInput.builder().primaryColor(randomUUID()).build();
    Theme theme = Theme.builder().setRandomUUID().build();
    ThemeModel expected = ThemeModel.builder().build();
    when(themeService.updateTheme(themeUpdateInput)).thenReturn(theme);
    when(themeMapper.themeToThemeModel(theme)).thenReturn(expected);

    ThemeModel actual = themeFacade.updateTheme(themeUpdateInput);

    verify(themeService).updateTheme(themeUpdateInput);
    verify(themeMapper).themeToThemeModel(theme);
    assertThat(actual).isNotNull().isEqualTo(expected);
  }
}
