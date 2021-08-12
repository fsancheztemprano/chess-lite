package dev.kurama.api.core.facade;

import dev.kurama.api.core.api.assembler.AuthorityModelAssembler;
import dev.kurama.api.core.api.domain.model.AuthorityModel;
import dev.kurama.api.core.api.mapper.AuthorityMapper;
import dev.kurama.api.core.service.AuthorityService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedModel;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthorityFacade {

  @NonNull
  private final AuthorityService authorityService;

  @NonNull
  private final AuthorityMapper authorityMapper;

  @NonNull
  private final AuthorityModelAssembler authorityModelAssembler;

  public PagedModel<AuthorityModel> getAll(Pageable pageable) {
    return authorityModelAssembler.toPagedModel(
      authorityMapper.authorityPageToAuthorityModelPage(
        authorityService.getAllAuthorities(pageable)));
  }

  public AuthorityModel findByAuthorityId(String authorityId) {
    return authorityModelAssembler.toModel(
      authorityMapper.authorityToAuthorityModel(
        authorityService.findAuthorityById(authorityId).orElseThrow()));
  }
}
