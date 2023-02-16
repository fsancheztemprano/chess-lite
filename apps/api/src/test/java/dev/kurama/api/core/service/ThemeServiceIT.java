package dev.kurama.api.core.service;

import static dev.kurama.api.core.domain.Theme.UNIQUE_ID;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import dev.kurama.api.core.domain.Theme;
import dev.kurama.api.core.hateoas.input.ThemeUpdateInput;
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

@ServiceLayerIntegrationTestConfig
@Import({ThemeService.class})
class ThemeServiceIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private ThemeService themeService;


  @Test
  void should_create_theme() {
    Theme actual = themeService.getTheme();

    assertNotNull(actual);
  }

  @Test
  void get_theme() {
    Theme expected = entityManager.persist(Theme.builder().id(UNIQUE_ID).primaryColor(randomUUID()).build());

    Theme actual = themeService.getTheme();

    assertThat(actual).isEqualTo(expected);
  }

  @Test
  void update_theme() {
    Theme expected = entityManager.persist(Theme.builder().id(UNIQUE_ID).primaryColor(randomUUID()).build());
    ThemeUpdateInput input = ThemeUpdateInput.builder().primaryColor(randomUUID()).build();

    Theme actual = themeService.updateTheme(input);

    assertThat(actual.getId()).isEqualTo(expected.getId());
    assertThat(actual.getPrimaryColor()).isEqualTo(input.getPrimaryColor());
    assertThat(actual.getAccentColor()).isEqualTo(input.getAccentColor());
  }
}
