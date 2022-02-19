package dev.kurama.api.core.rest;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_CREATE;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_DELETE;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_READ;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_UPDATE;
import static dev.kurama.api.core.constant.RestPathConstant.ROLE_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.support.JsonUtils.asJsonString;
import static dev.kurama.api.support.TestConstant.MOCK_MVC_HOST;
import static dev.kurama.api.support.TokenTestUtils.getAuthorizationHeader;
import static java.lang.String.format;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.facade.RoleFacade;
import dev.kurama.api.core.hateoas.assembler.RoleModelAssembler;
import dev.kurama.api.core.hateoas.input.RoleCreateInput;
import dev.kurama.api.core.hateoas.input.RoleUpdateInput;
import dev.kurama.api.core.hateoas.processor.RoleModelProcessor;
import dev.kurama.api.core.service.RoleFacility;
import dev.kurama.api.core.service.RoleService;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.api.support.ImportMappers;
import dev.kurama.api.support.ImportTestSecurityConfiguration;
import dev.kurama.api.support.TokenTestUtils;
import java.util.ArrayList;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles(value = "integration-test")
@ImportTestSecurityConfiguration
@WebMvcTest(controllers = RoleController.class)
@Import({RoleFacade.class, RoleModelProcessor.class, RoleModelAssembler.class})
@ImportMappers
class RoleControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @MockBean
  private RoleService roleService;

  @MockBean
  private RoleFacility roleFacility;

  @Nested
  class GetAllRolesITs {

    @Test
    void should_return_forbidden_without_role_read_authority() throws Exception {
      mockMvc.perform(get(ROLE_PATH)).andExpect(status().isForbidden());

      mockMvc.perform(get(ROLE_PATH).headers(TokenTestUtils.getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isForbidden());
    }

    @Test
    void should_get_all_roles() throws Exception {
      ArrayList<Role> roles = newArrayList(Role.builder().setRandomUUID().name(randomUUID()).build(),
        Role.builder().setRandomUUID().name(randomUUID()).build());
      Page<Role> expected = new PageImpl<Role>(roles, PageRequest.of(2, 2), 6);
      doReturn(expected).when(roleService).getAllRoles(any(), any());

      mockMvc.perform(
          get(ROLE_PATH).accept(HAL_FORMS_JSON_VALUE).headers(getAuthorizationHeader(jwtTokenProvider, ROLE_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(4)))
        .andExpect(jsonPath("$._links..href", everyItem(startsWith(MOCK_MVC_HOST + ROLE_PATH))))
        .andExpect(jsonPath("$._embedded.roleModels", hasSize(2)))
        .andExpect(
          jsonPath("$._embedded.roleModels[*].id", allOf(contains(roles.get(0).getId(), roles.get(1).getId()))))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }

    @Test
    void should_get_role_create_template_given_role_create_authority() throws Exception {
      Page<Role> expected = new PageImpl<Role>(newArrayList(), PageRequest.of(1, 1), 0);
      doReturn(expected).when(roleService).getAllRoles(any(), any());

      mockMvc.perform(get(ROLE_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, ROLE_READ, ROLE_CREATE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(4)))
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.create.method", equalTo(HttpMethod.POST.toString())))
        .andExpect(jsonPath("$._templates.create.target", equalTo(MOCK_MVC_HOST + ROLE_PATH)));
    }
  }

  @Nested
  class GetOneRoleITs {

    @Test
    void should_return_forbidden_without_role_read_authority() throws Exception {
      mockMvc.perform(get(ROLE_PATH + "/id")).andExpect(status().isForbidden());

      mockMvc.perform(
          get(ROLE_PATH + "/id").headers(TokenTestUtils.getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isForbidden());
    }

    @Test
    void should_get_one_role() throws Exception {
      Role expected = Role.builder().setRandomUUID().name(randomUUID()).build();
      doReturn(Optional.of(expected)).when(roleService).findRoleById(expected.getId());

      mockMvc.perform(get(format("%s/%s", ROLE_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, ROLE_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$.name", equalTo(expected.getName())))
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(
          jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + format("%s/%s", ROLE_PATH, expected.getId()))))
        .andExpect(jsonPath("$._links.roles.href", startsWith(MOCK_MVC_HOST + ROLE_PATH)))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }

    @Test
    void should_get_one_role_with_update_template_given_role_update_authority() throws Exception {
      Role expected = Role.builder().setRandomUUID().name(randomUUID()).build();
      doReturn(Optional.of(expected)).when(roleService).findRoleById(expected.getId());

      mockMvc.perform(get(format("%s/%s", ROLE_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, ROLE_READ, ROLE_UPDATE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.update.method", equalTo(HttpMethod.PATCH.toString())));
    }

    @Test
    void should_get_one_role_with_delete_template_given_role_delete_authority() throws Exception {
      Role expected = Role.builder().setRandomUUID().name(randomUUID()).coreRole(false).build();
      doReturn(Optional.of(expected)).when(roleService).findRoleById(expected.getId());

      mockMvc.perform(get(format("%s/%s", ROLE_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, ROLE_READ, ROLE_DELETE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.delete.method", equalTo(HttpMethod.DELETE.toString())));
    }
  }

  @Nested
  class CreateRoleITs {

    @Test
    void should_return_forbidden_without_role_create_authority() throws Exception {
      RoleCreateInput input = RoleCreateInput.builder().name("ROLE_NAME").build();
      mockMvc.perform(post(ROLE_PATH).contentType(MediaType.APPLICATION_JSON).content(asJsonString(input)))
        .andExpect(status().isForbidden());

      mockMvc.perform(post(ROLE_PATH).headers(TokenTestUtils.getAuthorizationHeader(jwtTokenProvider, ROLE_READ))
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isForbidden());
    }

    @Test
    void should_create_role() throws Exception {
      RoleCreateInput input = RoleCreateInput.builder().name("ROLE_NAME").build();
      Role expected = Role.builder().setRandomUUID().name(input.getName()).canLogin(false).build();
      doReturn(expected).when(roleService).create(input.getName());

      mockMvc.perform(post(ROLE_PATH).headers(TokenTestUtils.getAuthorizationHeader(jwtTokenProvider, ROLE_CREATE))
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))
          .accept(HAL_FORMS_JSON_VALUE))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())));
    }
  }

  @Nested
  class UpdateRoleITs {

    @Test
    void should_return_forbidden_without_role_update_authority() throws Exception {
      RoleUpdateInput input = RoleUpdateInput.builder().name("ROLE_NAME").build();
      mockMvc.perform(patch(format("%s/%s", ROLE_PATH, "roleId")).contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isForbidden());

      mockMvc.perform(patch(format("%s/%s", ROLE_PATH, "roleId")).headers(
          TokenTestUtils.getAuthorizationHeader(jwtTokenProvider, ROLE_READ))
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isForbidden());
    }

    @Test
    void should_update_role() throws Exception {
      RoleUpdateInput input = RoleUpdateInput.builder().name("ROLE_NAME").build();
      Role expected = Role.builder().setRandomUUID().name(input.getName()).build();
      doReturn(expected).when(roleService).update(expected.getId(), input);

      mockMvc.perform(patch(format("%s/%s", ROLE_PATH, expected.getId())).headers(
            TokenTestUtils.getAuthorizationHeader(jwtTokenProvider, ROLE_UPDATE))
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))
          .accept(HAL_FORMS_JSON_VALUE))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())));
    }
  }

  @Nested
  class DeleteRoleITs {

    @Test
    void should_return_forbidden_without_role_delete_authority() throws Exception {
      mockMvc.perform(delete(ROLE_PATH + "/id")).andExpect(status().isForbidden());

      mockMvc.perform(
          delete(ROLE_PATH + "/id").headers(TokenTestUtils.getAuthorizationHeader(jwtTokenProvider, ROLE_READ)))
        .andExpect(status().isForbidden());
    }

    @Test
    void should_delete_role() throws Exception {
      String roleId = randomUUID();
      mockMvc.perform(delete(format("%s/%s", ROLE_PATH, roleId)).headers(
        TokenTestUtils.getAuthorizationHeader(jwtTokenProvider, ROLE_DELETE))).andExpect(status().isNoContent());

      verify(roleFacility, times(1)).deleteRole(roleId);
    }
  }
}
