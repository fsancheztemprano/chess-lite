package dev.kurama.api.pact;

import static com.google.common.collect.Lists.newArrayList;
import static com.google.common.collect.Sets.newHashSet;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.springframework.beans.support.PagedListHolder.DEFAULT_PAGE_SIZE;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.facade.RoleFacade;
import dev.kurama.api.core.hateoas.assembler.RoleModelAssembler;
import dev.kurama.api.core.hateoas.processor.RoleModelProcessor;
import dev.kurama.api.core.rest.RoleController;
import dev.kurama.api.core.service.RoleFacility;
import dev.kurama.api.core.service.RoleService;
import dev.kurama.support.ImportMappers;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@WebMvcTest(controllers = RoleController.class)
@Import({RoleFacade.class, RoleModelProcessor.class, RoleModelAssembler.class})
@ImportMappers
public abstract class RoleControllerBase extends PactBase {

  @MockBean
  private RoleService roleService;

  @MockBean
  private RoleFacility roleFacility;

  @Override
  @BeforeEach
  void setUp() throws Exception {
    super.setUp();

    Role pactRole = Role.builder()
      .id("pactRoleId")
      .name("PACT_ROLE")
      .coreRole(false)
      .canLogin(true)
      .authorities(newHashSet(Authority.builder().setRandomUUID().name("pact:update").build(),
        Authority.builder().setRandomUUID().name("pact:read").build(),
        Authority.builder().setRandomUUID().name("pact:delete").build()))
      .build();
    PageRequest pageRequest = PageRequest.ofSize(DEFAULT_PAGE_SIZE);
    PageImpl<Role> page = new PageImpl<>(newArrayList(pactRole,
      Role.builder().setRandomUUID().name("PACT_ROLE_2").authorities(pactRole.getAuthorities()).build(),
      Role.builder().setRandomUUID().name("PACT_ROLE_3").authorities(pactRole.getAuthorities()).build()), pageRequest,
      3);
    Role newRole = Role.builder()
      .id("newPactRoleId")
      .name("NEW_PACT_ROLE")
      .coreRole(false)
      .canLogin(true)
      .authorities(newHashSet(Authority.builder().setRandomUUID().name("pact:read").build()))
      .build();
    doReturn(page).when(roleService).getAllRoles(any(), any());
    doReturn(Optional.of(pactRole)).when(roleService).findRoleById(pactRole.getId());
    doReturn(newRole).when(roleService).create("NEW_PACT_ROLE");
    doThrow(new RoleExistsException("pactRole")).when(roleService).create("PACT_ROLE");
  }
}
