package dev.kurama.api.core.mapper;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.hateoas.model.AuthorityModel;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

@Mapper
public interface AuthorityMapper {

  AuthorityModel authorityToAuthorityModel(Authority authority);

  default Page<AuthorityModel> authorityPageToAuthorityModelPage(Page<Authority> authorities) {
    return authorities.map(this::authorityToAuthorityModel);
  }

  default Set<AuthorityModel> authoritySetToAuthorityModelSet(Set<Authority> authorities) {
    return authorities.stream().map(this::authorityToAuthorityModel).collect(Collectors.toSet());
  }

}
