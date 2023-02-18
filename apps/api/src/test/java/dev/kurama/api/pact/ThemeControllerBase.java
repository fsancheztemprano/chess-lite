package dev.kurama.api.pact;

import static org.mockito.Mockito.doReturn;

import dev.kurama.api.core.domain.Theme;
import dev.kurama.api.core.facade.ThemeFacade;
import dev.kurama.api.core.hateoas.input.ThemeUpdateInput;
import dev.kurama.api.core.hateoas.processor.ThemeModelProcessor;
import dev.kurama.api.core.rest.ThemeController;
import dev.kurama.api.core.service.ThemeService;
import dev.kurama.support.ImportMappers;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

@WebMvcTest(controllers = ThemeController.class)
@Import({ThemeFacade.class, ThemeModelProcessor.class})
@ImportMappers
public abstract class ThemeControllerBase extends PactBase {

  @MockBean
  private ThemeService themeService;

  @Override
  protected void beforeEach() throws Exception {
    Theme theme = Theme.builder().primaryColor("#85238f").accentColor("#2c8588").warnColor("#fa0000").build();
    Theme newTheme = Theme.builder().primaryColor("#3e58dc").accentColor("#26881b").warnColor("#6c0707").build();

    doReturn(theme).when(themeService).getTheme();
    doReturn(newTheme).when(themeService)
      .updateTheme(
        ThemeUpdateInput.builder().primaryColor("#3e58dc").accentColor("#26881b").warnColor("#6c0707").build());
  }
}
