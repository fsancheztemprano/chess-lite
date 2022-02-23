package dev.kurama.api.core.facade;

import static com.google.common.collect.Lists.newArrayList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.exception.domain.not.found.DomainEntityNotFoundException;
import dev.kurama.api.core.hateoas.assembler.AuthorityModelAssembler;
import dev.kurama.api.core.hateoas.model.AuthorityModel;
import dev.kurama.api.core.mapper.AuthorityMapper;
import dev.kurama.api.core.service.AuthorityService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.hateoas.PagedModel;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class AuthorityFacadeTest {

  @InjectMocks
  private AuthorityFacade authorityFacade;

  @Mock
  private AuthorityService authorityService;

  @Mock
  private AuthorityMapper authorityMapper;

  @Mock
  private AuthorityModelAssembler authorityModelAssembler;


  @Test
  void should_get_and_map_all_authorities() {
    PageRequest PAGEABLE = PageRequest.of(1, 2);
    PageImpl<Authority> pagedAuthorities = new PageImpl<>(newArrayList(), PAGEABLE, 2);
    PageImpl<AuthorityModel> authorityModels = new PageImpl<>(newArrayList(), PAGEABLE, 2);
    PagedModel<AuthorityModel> expected = PagedModel.of(authorityModels.getContent(),
      new PagedModel.PageMetadata(2, 1, 2));
    when(authorityService.getAllAuthorities(PAGEABLE)).thenReturn(pagedAuthorities);
    when(authorityMapper.authorityPageToAuthorityModelPage(pagedAuthorities)).thenReturn(authorityModels);
    when(authorityModelAssembler.toPagedModel(authorityModels)).thenReturn(expected);

    PagedModel<AuthorityModel> actual = authorityFacade.getAll(PAGEABLE);

    verify(authorityService).getAllAuthorities(PAGEABLE);
    verify(authorityMapper).authorityPageToAuthorityModelPage(pagedAuthorities);
    verify(authorityModelAssembler).toPagedModel(authorityModels);
    assertThat(actual).isNotNull().isEqualTo(expected);
  }

  @Test
  void should_find_and_map_by_authority_id() throws DomainEntityNotFoundException {
    Authority authority = Authority.builder().name("test:auth").setRandomUUID().build();
    AuthorityModel expected = AuthorityModel.builder().name(authority.getName()).id(authority.getId()).build();
    when(authorityService.findAuthorityById(authority.getId())).thenReturn(Optional.of(authority));
    when(authorityMapper.authorityToAuthorityModel(authority)).thenReturn(expected);

    AuthorityModel actual = authorityFacade.findByAuthorityId(authority.getId());

    verify(authorityService).findAuthorityById(authority.getId());
    verify(authorityMapper).authorityToAuthorityModel(authority);
    assertThat(actual).isNotNull().isEqualTo(expected);
  }
}
