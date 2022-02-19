package dev.kurama.api.core.facade;

import dev.kurama.api.core.exception.domain.not.found.DomainEntityNotFoundException;
import dev.kurama.api.core.hateoas.assembler.AuthorityModelAssembler;
import dev.kurama.api.core.hateoas.model.AuthorityModel;
import dev.kurama.api.core.mapper.AuthorityMapper;
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
    return authorityModelAssembler.toPagedModel(authorityMapper.authorityPageToAuthorityModelPage(authorityService.getAllAuthorities(
      pageable)));
  }

  public AuthorityModel findByAuthorityId(String authorityId) throws DomainEntityNotFoundException {
    return authorityMapper.authorityToAuthorityModel(authorityService.findAuthorityById(authorityId)
      .orElseThrow(() -> new DomainEntityNotFoundException(authorityId)));
  }
}
