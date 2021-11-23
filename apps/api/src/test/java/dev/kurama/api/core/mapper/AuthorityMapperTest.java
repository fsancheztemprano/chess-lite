package dev.kurama.api.core.mapper;

import static com.google.common.collect.Lists.newArrayList;
import static com.google.common.collect.Sets.newHashSet;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.hateoas.model.AuthorityModel;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class AuthorityMapperTest {

  @InjectMocks
  private AuthorityMapperImpl userMapper;

  @Test
  void authorityPageToAuthorityModelPage() {
    Authority authority1 = Authority.builder().setRandomUUID().name("authority1").build();
    Authority authority2 = Authority.builder().setRandomUUID().name("authority2").build();
    PageImpl<Authority> page = new PageImpl<Authority>(newArrayList(authority1, authority2));

    Page<AuthorityModel> actual = userMapper.authorityPageToAuthorityModelPage(page);

    assertThat(actual.getContent()).hasSize(2)
      .extracting("id", "name")
      .contains(
        tuple(authority1.getId(), authority1.getName()),
        tuple(authority2.getId(), authority2.getName()));
  }

  @Test
  void authoritySetToAuthorityModelSet() {
    Authority authority1 = Authority.builder().setRandomUUID().name("authority1").build();
    Authority authority2 = Authority.builder().setRandomUUID().name("authority2").build();
    HashSet<Authority> authorities = newHashSet(authority1, authority2);

    Set<AuthorityModel> actual = userMapper.authoritySetToAuthorityModelSet(authorities);

    assertThat(actual).hasSize(2)
      .extracting("id", "name")
      .contains(
        tuple(authority1.getId(), authority1.getName()),
        tuple(authority2.getId(), authority2.getName()));
  }
}
