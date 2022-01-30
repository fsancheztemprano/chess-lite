package dev.kurama.api.core.rest;

import static com.google.common.collect.Lists.newArrayList;
import static com.google.common.collect.Sets.newHashSet;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.framework.JsonUtils.asJsonString;
import static java.lang.String.format;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
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
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.facade.UserFacade;
import dev.kurama.api.core.hateoas.input.UserAuthoritiesInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.hateoas.input.UserRoleInput;
import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.rest.UserControllerTest.UserControllerConfig;
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
import org.springframework.hateoas.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {UserController.class})
@Import(UserControllerConfig.class)
class UserControllerTest {

  @Autowired
  private UserFacade facade;

  @Autowired
  private UserController controller;

  private MockMvc mockMvc;

  private UserModel user;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller)
                             .setControllerAdvice(new ExceptionHandlers())
                             .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                             .build();

    user = UserModel.builder()
                    .id(randomUUID())
                    .username("username")
                    .build();
  }


  @Test
  void should_get_all_users() throws Exception {
    PagedModel<UserModel> expected = PagedModel.of(newArrayList(user), new PagedModel.PageMetadata(2, 1, 2));
    when(facade.getAll(any(Pageable.class), any())).thenReturn(expected);

    mockMvc.perform(get(USER_PATH))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.content").isArray())
           .andExpect(jsonPath("$.content", hasSize(1)))
           .andExpect(jsonPath("$.content..id", hasItem(user.getId())));
  }

  @Nested
  class GetUserTests {

    @Test
    void should_get_a_user_by_id() throws Exception {
      when(facade.findByUserId(user.getId())).thenReturn(user);

      mockMvc.perform(get(format("%s/%s", USER_PATH, user.getId())))
             .andExpect(status().isOk())
             .andExpect(jsonPath("$.id", equalTo(user.getId())));
    }

    @Test
    void get_nonexistent_should_throw() throws Exception {
      String notFoundId = randomUUID();
      doThrow(UserNotFoundException.class).when(facade)
                                          .findByUserId(notFoundId);

      mockMvc.perform(get(format("%s/%s", USER_PATH, notFoundId)))
             .andExpect(status().isNotFound());
    }
  }

  @Nested
  class CreateUserTests {

    UserInput input = UserInput.builder()
                               .username("username")
                               .password("password")
                               .email("em@il")
                               .build();

    @Test
    void should_create_a_user() throws Exception {
      doReturn(user).when(facade)
                    .create(input);

      mockMvc.perform(post(USER_PATH).accept(MediaType.APPLICATION_JSON)
                                     .contentType(MediaType.APPLICATION_JSON)
                                     .content(asJsonString(input)))
             .andExpect(status().isCreated())
             .andExpect(jsonPath("$.id", equalTo(user.getId())));

    }

    @Test
    void should_throw_if_username_exists() throws Exception {
      doThrow(UsernameExistsException.class).when(facade)
                                            .create(input);

      mockMvc.perform(post(USER_PATH).accept(MediaType.APPLICATION_JSON)
                                     .contentType(MediaType.APPLICATION_JSON)
                                     .content(asJsonString(input)))
             .andExpect(status().isConflict());
    }

    @Test
    void should_throw_if_email_exists() throws Exception {
      doThrow(EmailExistsException.class).when(facade)
                                         .create(input);

      mockMvc.perform(post(USER_PATH).accept(MediaType.APPLICATION_JSON)
                                     .contentType(MediaType.APPLICATION_JSON)
                                     .content(asJsonString(input)))
             .andExpect(status().isConflict());
    }
  }

  @Nested
  class UpdateUserTests {

    UserInput input = UserInput.builder()
                               .username("new_username")
                               .password("new_password")
                               .email("new_em@il")
                               .build();

    @Test
    void should_update_a_user() throws Exception {
      doReturn(user).when(facade)
                    .update(user.getId(), input);

      mockMvc.perform(patch(format("%s/%s", USER_PATH, user.getId())).accept(MediaType.APPLICATION_JSON)
                                                                     .contentType(MediaType.APPLICATION_JSON)
                                                                     .content(asJsonString(input)))
             .andExpect(status().isOk())
             .andExpect(jsonPath("$.id", equalTo(user.getId())));
    }

    @Test
    void should_throw_if_user_does_not_exist() throws Exception {
      doThrow(UserNotFoundException.class).when(facade)
                                          .update(user.getId(), input);

      mockMvc.perform(patch(format("%s/%s", USER_PATH, user.getId())).accept(MediaType.APPLICATION_JSON)
                                                                     .contentType(MediaType.APPLICATION_JSON)
                                                                     .content(asJsonString(input)))
             .andExpect(status().isNotFound());
    }

    @Test
    void should_throw_if_username_exists() throws Exception {
      doThrow(UsernameExistsException.class).when(facade)
                                            .update(user.getId(), input);

      mockMvc.perform(patch(format("%s/%s", USER_PATH, user.getId())).accept(MediaType.APPLICATION_JSON)
                                                                     .contentType(MediaType.APPLICATION_JSON)
                                                                     .content(asJsonString(input)))
             .andExpect(status().isConflict());
    }

    @Test
    void should_throw_if_email_exists() throws Exception {
      doThrow(EmailExistsException.class).when(facade)
                                         .update(user.getId(), input);

      mockMvc.perform(patch(format("%s/%s", USER_PATH, user.getId())).accept(MediaType.APPLICATION_JSON)
                                                                     .contentType(MediaType.APPLICATION_JSON)
                                                                     .content(asJsonString(input)))
             .andExpect(status().isConflict());
    }
  }

  @Nested
  class UpdateUserRoleTests {

    UserRoleInput input = UserRoleInput.builder()
                                       .roleId(randomUUID())
                                       .build();

    @Test
    void should_update_user_role() throws Exception {
      doReturn(user).when(facade)
                    .update(eq(user.getId()), any(UserInput.class));

      mockMvc.perform(patch(format("%s/%s/role", USER_PATH, user.getId())).accept(MediaType.APPLICATION_JSON)
                                                                          .contentType(MediaType.APPLICATION_JSON)
                                                                          .content(asJsonString(input)))
             .andExpect(status().isOk())
             .andExpect(jsonPath("$.id", equalTo(user.getId())));
    }

    @Test
    void should_throw_if_user_does_not_exist() throws Exception {
      doThrow(UserNotFoundException.class).when(facade)
                                          .update(eq(user.getId()), any(UserInput.class));

      mockMvc.perform(patch(format("%s/%s/role", USER_PATH, user.getId())).accept(MediaType.APPLICATION_JSON)
                                                                          .contentType(MediaType.APPLICATION_JSON)
                                                                          .content(asJsonString(input)))
             .andExpect(status().isNotFound());
    }

    @Test
    void should_throw_if_role_does_not_exist() throws Exception {
      doThrow(RoleNotFoundException.class).when(facade)
                                          .update(eq(user.getId()), any(UserInput.class));

      mockMvc.perform(patch(format("%s/%s/role", USER_PATH, user.getId())).accept(MediaType.APPLICATION_JSON)
                                                                          .contentType(MediaType.APPLICATION_JSON)
                                                                          .content(asJsonString(input)))
             .andExpect(status().isNotFound());
    }
  }

  @Nested
  class UpdateUserAuthoritiesTests {

    String id = randomUUID();
    UserAuthoritiesInput input = UserAuthoritiesInput.builder()
                                                     .authorityIds(newHashSet(id))
                                                     .build();

    @Test
    void should_update_user_authorities() throws Exception {
      doReturn(user).when(facade)
                    .update(eq(user.getId()), any(UserInput.class));

      mockMvc.perform(patch(format("%s/%s/authorities", USER_PATH, user.getId())).accept(MediaType.APPLICATION_JSON)
                                                                                 .contentType(
                                                                                   MediaType.APPLICATION_JSON)
                                                                                 .content(asJsonString(input)))
             .andExpect(status().isOk())
             .andExpect(jsonPath("$.id", equalTo(user.getId())));
    }

    @Test
    void should_throw_if_user_does_not_exist() throws Exception {
      doThrow(UserNotFoundException.class).when(facade)
                                          .update(eq(user.getId()), any(UserInput.class));

      mockMvc.perform(patch(format("%s/%s/authorities", USER_PATH, user.getId())).accept(MediaType.APPLICATION_JSON)
                                                                                 .contentType(
                                                                                   MediaType.APPLICATION_JSON)
                                                                                 .content(asJsonString(input)))
             .andExpect(status().isNotFound());
    }
  }


  @Nested
  class DeleteUserTests {

    @Test
    void should_delete_user() throws Exception {
      mockMvc.perform(delete(format("%s/%s", USER_PATH, user.getId())))
             .andExpect(status().isNoContent());

      verify(facade).deleteById(user.getId());
    }

    @Test
    void should_throw_if_user_does_not_exist() throws Exception {
      doThrow(UserNotFoundException.class).when(facade)
                                          .deleteById(user.getId());

      mockMvc.perform(delete(format("%s/%s", USER_PATH, user.getId())))
             .andExpect(status().isNotFound());

    }
  }

  @Nested
  class RequestUserActivationTokenTests {

    @Test
    void should_request_activation_token() throws Exception {
      mockMvc.perform(post(format("%s/%s", USER_PATH, user.getId())))
             .andExpect(status().isNoContent());

      verify(facade).requestActivationToken(user.getId());
    }

    @Test
    void should_throw_if_user_has_recent_activation_token() throws Exception {
      doThrow(UserNotFoundException.class).when(facade)
                                          .requestActivationToken(user.getId());

      mockMvc.perform(post(format("%s/%s", USER_PATH, user.getId())))
             .andExpect(status().isNotFound());
    }

  }

  @TestConfiguration
  protected static class UserControllerConfig {

    @Bean
    public UserFacade UserFacade() {
      return Mockito.mock(UserFacade.class);
    }
  }
}
