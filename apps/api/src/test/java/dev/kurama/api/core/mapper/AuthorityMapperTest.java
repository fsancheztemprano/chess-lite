package dev.kurama.api.core.mapper;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.hateoas.model.AuthorityModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.HashSet;
import java.util.Set;

import static com.google.common.collect.Lists.newArrayList;
import static com.google.common.collect.Sets.newHashSet;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;
import static org.junit.jupiter.api.Assertions.assertNull;

class AuthorityMapperTest {

  private AuthorityMapper mapper;

  @BeforeEach
  void setUp() {
    mapper = Mappers.getMapper(AuthorityMapper.class);
  }

  @Test
  void should_return_null_when_authority_is_null() {
    assertNull(mapper.authorityToAuthorityModel(null));
  }

  @Test
  void authority_to_authority_model() {
    Authority authority = Authority.builder()
                                   .setRandomUUID()
                                   .name(randomUUID())
                                   .build();

    AuthorityModel actual = mapper.authorityToAuthorityModel(authority);

    assertThat(actual).hasFieldOrPropertyWithValue("id", authority.getId())
                      .hasFieldOrPropertyWithValue("name", authority.getName());
  }

  @Test
  void authority_page_to_authority_model_page() {
    Authority authority1 = Authority.builder()
                                    .setRandomUUID()
                                    .name("authority1")
                                    .build();
    Authority authority2 = Authority.builder()
                                    .setRandomUUID()
                                    .name("authority2")
                                    .build();
    PageImpl<Authority> page = new PageImpl<Authority>(newArrayList(authority1, authority2));

    Page<AuthorityModel> actual = mapper.authorityPageToAuthorityModelPage(page);

    assertThat(actual.getContent()).hasSize(2)
                                   .extracting("id", "name")
                                   .contains(tuple(authority1.getId(), authority1.getName()), tuple(authority2.getId(), authority2.getName()));
  }

  @Test
  void authority_set_to_authority_model_set() {
    Authority authority1 = Authority.builder()
                                    .setRandomUUID()
                                    .name("authority1")
                                    .build();
    Authority authority2 = Authority.builder()
                                    .setRandomUUID()
                                    .name("authority2")
                                    .build();
    HashSet<Authority> authorities = newHashSet(authority1, authority2);

    Set<AuthorityModel> actual = mapper.authoritySetToAuthorityModelSet(authorities);

    assertThat(actual).hasSize(2)
                      .extracting("id", "name")
                      .contains(tuple(authority1.getId(), authority1.getName()), tuple(authority2.getId(), authority2.getName()));
  }
}
