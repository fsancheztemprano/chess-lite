package dev.kurama.chess.backend.auth.api.mapper;

import dev.kurama.chess.backend.auth.api.domain.model.AuthorityModel;
import dev.kurama.chess.backend.auth.domain.Authority;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

@Mapper
public interface AuthorityMapper {

  AuthorityModel authorityToAuthorityModel(Authority authority);


  default Page<AuthorityModel> authorityPageToAuthorityModelPage(Page<Authority> authorities) {
    return authorities.map(this::authorityToAuthorityModel);
  }

}
