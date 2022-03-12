package dev.kurama.api.pact;

import static com.google.common.collect.Lists.newArrayList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.facade.AuthorityFacade;
import dev.kurama.api.core.hateoas.assembler.AuthorityModelAssembler;
import dev.kurama.api.core.hateoas.processor.AuthorityModelProcessor;
import dev.kurama.api.core.rest.AuthorityController;
import dev.kurama.api.core.service.AuthorityService;
import dev.kurama.support.ImportMappers;
import java.util.Optional;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@WebMvcTest(controllers = AuthorityController.class)
@Import({AuthorityFacade.class, AuthorityModelProcessor.class, AuthorityModelAssembler.class})
@ImportMappers
public abstract class AuthorityControllerBase extends PactBase {

  @MockBean
  private AuthorityService authorityService;

  @Override
  protected void beforeEach() throws Exception {
    Authority pactUpdateAuthority = Authority.builder().id("pactUpdateAuthorityId").name("pact:update").build();
    PageRequest pageRequest = PageRequest.ofSize(1000);
    PageImpl<Authority> page = new PageImpl<>(
      newArrayList(pactUpdateAuthority, Authority.builder().setRandomUUID().name("pact:read").build(),
        Authority.builder().setRandomUUID().name("pact:delete").build()), pageRequest, 3);

    doReturn(page).when(authorityService).getAllAuthorities(pageRequest);
    doReturn(Optional.empty()).when(authorityService).findAuthorityById(anyString());
    doReturn(Optional.of(pactUpdateAuthority)).when(authorityService).findAuthorityById(pactUpdateAuthority.getId());
  }
}
