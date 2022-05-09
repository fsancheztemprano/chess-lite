package dev.kurama.api.core.mapper;

import static com.google.common.collect.Sets.newHashSet;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.hateoas.model.GlobalSettingsModel;
import org.assertj.core.groups.Tuple;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class GlobalSettingsMapperTest {

  @SuppressWarnings("SpringJavaAutowiredMembersInspection")
  @Autowired
  private GlobalSettingsMapper mapper;

  @Test
  void should_return_null_when_global_settings_is_null() {
    assertNull(mapper.globalSettingsToGlobalSettingsModel(null));
  }

  @Test
  void global_settings_to_global_settings_model() {
    Authority adminAuthority = Authority.builder().setRandomUUID().name(randomAlphanumeric(8)).build();
    Authority modAuthority = Authority.builder().setRandomUUID().name(randomAlphanumeric(8)).build();
    GlobalSettings globalSettings = GlobalSettings.builder()
      .setRandomUUID()
      .signupOpen(false)
      .defaultRole(
        Role.builder().setRandomUUID().name(randomUUID()).authorities(newHashSet(adminAuthority, modAuthority)).build())
      .build();

    GlobalSettingsModel actual = mapper.globalSettingsToGlobalSettingsModel(globalSettings);

    assertThat(actual).hasFieldOrPropertyWithValue("signupOpen", globalSettings.isSignupOpen())
      .extracting("defaultRole")
      .hasFieldOrPropertyWithValue("id", globalSettings.getDefaultRole().getId())
      .hasFieldOrPropertyWithValue("name", globalSettings.getDefaultRole().getName());
    assertThat(actual.getDefaultRole().getAuthorities()).hasSize(2)
      .extracting("id", "name")
      .containsExactlyInAnyOrder(Tuple.tuple(adminAuthority.getId(), adminAuthority.getName()),
        Tuple.tuple(modAuthority.getId(), modAuthority.getName()));

  }

  @TestConfiguration
  protected static class GlobalSettingsMapperConfig {

    @Bean
    public GlobalSettingsMapper globalSettingsMapper() {
      return Mappers.getMapper(GlobalSettingsMapper.class);
    }

    @Bean
    public RoleMapper roleMapper() {
      return Mappers.getMapper(RoleMapper.class);
    }

    @Bean
    public AuthorityMapper authorityMapper() {
      return Mappers.getMapper(AuthorityMapper.class);
    }
  }
}
