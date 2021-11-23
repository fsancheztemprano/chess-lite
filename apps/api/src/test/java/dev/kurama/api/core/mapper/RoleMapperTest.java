package dev.kurama.api.core.mapper;

import static com.google.common.collect.Lists.newArrayList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.hateoas.model.RoleModel;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class RoleMapperTest {

  @InjectMocks
  private RoleMapperImpl roleMapper;

  @Mock
  private AuthorityMapper authorityMapper;

  @Test
  void rolePageToRoleModelPage() {
    Role role1 = Role.builder().setRandomUUID().name("Role1").build();
    Role role2 = Role.builder().setRandomUUID().name("Role2").build();
    PageImpl<Role> page = new PageImpl<Role>(newArrayList(role1, role2));

    Page<RoleModel> actual = roleMapper.rolePageToRoleModelPage(page);

    assertThat(actual.getContent()).hasSize(2)
      .extracting("id", "name")
      .contains(
        tuple(role1.getId(), role1.getName()),
        tuple(role2.getId(), role2.getName()));
  }
}
