package dev.kurama.api.core.rest;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.constant.RestPathConstant.ROLE_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.support.JsonUtils.asJsonString;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.facade.RoleFacade;
import dev.kurama.api.core.hateoas.input.RoleCreateInput;
import dev.kurama.api.core.hateoas.input.RoleUpdateInput;
import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.rest.RoleControllerTest.RoleControllerConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.hateoas.MediaTypes;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {RoleController.class})
@Import(RoleControllerConfig.class)
class RoleControllerTest {

  @Autowired
  private RoleFacade facade;

  @Autowired
  private RoleController controller;

  private MockMvc mockMvc;

  private RoleModel role;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller)
      .setControllerAdvice(new ExceptionHandlers())
      .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
      .build();

    role = RoleModel.builder().id(randomUUID()).coreRole(true).name("R1").build();
  }

  @Test
  void should_get_all_roles() throws Exception {
    PagedModel<RoleModel> expected = PagedModel.of(newArrayList(role), new PagedModel.PageMetadata(2, 1, 2));
    when(facade.getAll(any(Pageable.class), any())).thenReturn(expected);

    mockMvc.perform(get(ROLE_PATH))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content").isArray())
      .andExpect(jsonPath("$.content", hasSize(1)))
      .andExpect(jsonPath("$.content..id", hasItem(role.getId())));
  }

  @Nested
  class GetOneRoleTests {

    @Test
    void should_get_a_role() throws Exception {
      when(facade.findByRoleId(role.getId())).thenReturn(role);

      mockMvc.perform(get(ROLE_PATH + "/" + role.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(role.getId())));
    }

    @Test
    void get_nonexistent_role_should_throw_exception() throws Exception {
      String notFoundId = randomUUID();
      doThrow(RoleNotFoundException.class).when(facade).findByRoleId(notFoundId);

      mockMvc.perform(get(ROLE_PATH + "/" + notFoundId)).andExpect(status().isNotFound());
    }
  }

  @Nested
  class CreateRoleTests {

    @Test
    void should_create_a_role() throws Exception {
      RoleCreateInput input = RoleCreateInput.builder().name("NEW_ROLE").build();
      when(facade.create(input.getName())).thenReturn(role);

      mockMvc.perform(post(ROLE_PATH).accept(MediaTypes.HAL_FORMS_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isOk()).andExpect(jsonPath("$.id", equalTo(role.getId())));

    }

    @Test
    void creating_and_existing_role_should_throw_exception() throws Exception {
      RoleCreateInput input = RoleCreateInput.builder().name("EXISTING").build();
      doThrow(RoleExistsException.class).when(facade).create(input.getName());

      mockMvc.perform(post(ROLE_PATH).accept(MediaTypes.HAL_FORMS_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isConflict());
    }
  }

  @Nested
  class UpdateRoleTests {

    RoleUpdateInput input = RoleUpdateInput.builder().name("NEW_NAME").canLogin(true).build();

    @Test
    void should_update_a_role() throws Exception {
      when(facade.update(role.getId(), input)).thenReturn(role);

      mockMvc.perform(patch(ROLE_PATH + "/" + role.getId()).accept(MediaTypes.HAL_FORMS_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isOk()).andExpect(jsonPath("$.id", equalTo(role.getId())));
    }

    @Test
    void updating_nonexistent_role_should_throw_exception() throws Exception {
      String notFoundId = randomUUID();
      doThrow(RoleNotFoundException.class).when(facade).update(notFoundId, input);

      mockMvc.perform(patch(ROLE_PATH + "/" + notFoundId).accept(MediaTypes.HAL_FORMS_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isNotFound());
    }

    @Test
    void updating_immutable_role_should_throw_exception() throws Exception {
      doThrow(ImmutableRoleException.class).when(facade).update(role.getId(), input);

      mockMvc.perform(patch(ROLE_PATH + "/" + role.getId()).accept(MediaTypes.HAL_FORMS_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isForbidden());
    }
  }

  @Nested
  class DeleteRoleTests {

    @Test
    void should_delete_a_role() throws Exception {
      mockMvc.perform(delete(ROLE_PATH + "/" + role.getId())).andExpect(status().isNoContent());

      verify(facade).delete(role.getId());
    }

    @Test
    void deleting_nonexistent_role_should_throw_exception() throws Exception {
      String notFoundId = randomUUID();
      doThrow(RoleNotFoundException.class).when(facade).delete(notFoundId);

      mockMvc.perform(delete(ROLE_PATH + "/" + notFoundId)).andExpect(status().isNotFound());
    }


    @Test
    void deleting_immutable_role_should_throw_exception() throws Exception {
      doThrow(ImmutableRoleException.class).when(facade).delete(role.getId());

      mockMvc.perform(delete(ROLE_PATH + "/" + role.getId())).andExpect(status().isForbidden());
    }
  }


  @TestConfiguration
  protected static class RoleControllerConfig {

    @Bean
    public RoleFacade RoleFacade() {
      return Mockito.mock(RoleFacade.class);
    }
  }
}
