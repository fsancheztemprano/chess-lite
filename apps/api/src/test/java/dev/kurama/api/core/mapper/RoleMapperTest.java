package dev.kurama.api.core.mapper;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;
import static org.junit.jupiter.api.Assertions.assertNull;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.hateoas.model.RoleModel;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class RoleMapperTest {

  @SuppressWarnings("SpringJavaAutowiredMembersInspection")
  @Autowired
  private RoleMapper mapper;

  @Test
  void should_return_null_when_role_is_null() {
    assertNull(mapper.roleToRoleModel(null));
  }

  @Test
  void should_map_role_to_role_model() {
    Role role = Role.builder()
      .setRandomUUID()
      .name(randomUUID())
      .build();

    RoleModel actual = mapper.roleToRoleModel(role);

    assertThat(actual).hasFieldOrPropertyWithValue("id", role.getId())
      .hasFieldOrPropertyWithValue("name", role.getName());

  }

  @Test
  void should_map_role_page_to_role_model_page() {
    Role role1 = Role.builder()
      .setRandomUUID()
      .name("Role1")
      .build();
    Role role2 = Role.builder()
      .setRandomUUID()
      .name("Role2")
      .build();
    PageImpl<Role> page = new PageImpl<Role>(newArrayList(role1, role2));

    Page<RoleModel> actual = mapper.rolePageToRoleModelPage(page);

    assertThat(actual.getContent()).hasSize(2)
      .extracting("id", "name")
      .contains(tuple(role1.getId(), role1.getName()), tuple(role2.getId(), role2.getName()));
  }

  @TestConfiguration
  protected static class GlobalSettingsMapperConfig {

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
