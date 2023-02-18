package dev.kurama.api.core.mapper;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;

import dev.kurama.api.core.domain.Theme;
import dev.kurama.api.core.hateoas.model.ThemeModel;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class ThemeMapperTest {

  @SuppressWarnings("SpringJavaAutowiredMembersInspection")
  @Autowired
  private ThemeMapper mapper;

  @Test
  void should_return_null_when_theme_is_null() {
    assertNull(mapper.themeToThemeModel(null));
  }

  @Test
  void theme_to_theme_model() {
    Theme theme = Theme.builder().setRandomUUID().primaryColor(randomUUID()).build();

    ThemeModel actual = mapper.themeToThemeModel(theme);

    assertThat(actual).hasFieldOrPropertyWithValue("primaryColor", theme.getPrimaryColor());
  }

  @TestConfiguration
  protected static class ThemeMapperConfig {

    @Bean
    public ThemeMapper themeMapper() {
      return Mappers.getMapper(ThemeMapper.class);
    }

  }
}
