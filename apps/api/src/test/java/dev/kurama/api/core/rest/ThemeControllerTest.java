package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.THEME_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.support.JsonUtils.asJsonString;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.core.facade.ThemeFacade;
import dev.kurama.api.core.hateoas.input.ThemeUpdateInput;
import dev.kurama.api.core.hateoas.model.ThemeModel;
import dev.kurama.api.core.rest.ThemeControllerTest.ThemeControllerConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {ThemeController.class})
@Import(ThemeControllerConfig.class)
class ThemeControllerTest {

  @Autowired
  private ThemeFacade facade;

  @Autowired
  private ThemeController controller;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new ExceptionHandlers()).build();
  }

  @Test
  void should_get_theme() throws Exception {
    ThemeModel expected = ThemeModel.builder().primaryColor(randomUUID()).build();
    when(facade.getTheme()).thenReturn(expected);

    mockMvc.perform(get(THEME_PATH))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.primaryColor", equalTo(expected.getPrimaryColor())));
  }

  @Nested
  class UpdateThemeTests {

    @Test
    void should_update_theme() throws Exception {
      ThemeModel expected = ThemeModel.builder().primaryColor(randomUUID()).build();
      ThemeUpdateInput input = ThemeUpdateInput.builder().primaryColor(randomUUID()).build();

      when(facade.updateTheme(input)).thenReturn(expected);

      mockMvc.perform(patch(THEME_PATH).accept(MediaTypes.HAL_FORMS_JSON_VALUE)
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.primaryColor", equalTo(expected.getPrimaryColor())));
    }
  }

  @TestConfiguration
  protected static class ThemeControllerConfig {

    @Bean
    public ThemeFacade themeFacade() {
      return Mockito.mock(ThemeFacade.class);
    }
  }
}
