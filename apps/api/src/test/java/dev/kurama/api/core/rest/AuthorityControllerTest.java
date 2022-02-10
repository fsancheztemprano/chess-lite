package dev.kurama.api.core.rest;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.constant.RestPathConstant.AUTHORITY_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.core.exception.domain.not.found.DomainEntityNotFoundException;
import dev.kurama.api.core.facade.AuthorityFacade;
import dev.kurama.api.core.hateoas.model.AuthorityModel;
import dev.kurama.api.core.rest.AuthorityControllerTest.AuthorityControllerConfig;
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
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {AuthorityController.class})
@Import(AuthorityControllerConfig.class)
class AuthorityControllerTest {

  @Autowired
  private AuthorityFacade facade;

  @Autowired
  private AuthorityController controller;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller)
                             .setControllerAdvice(new ExceptionHandlers())
                             .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                             .build();
  }


  @Test
  void should_get_all_authorities() throws Exception {
    AuthorityModel authority = AuthorityModel.builder()
                                             .id(randomUUID())
                                             .name("AUTH")
                                             .build();
    PagedModel<AuthorityModel> expected = PagedModel.of(newArrayList(authority), new PagedModel.PageMetadata(2, 1, 2));

    when(facade.getAll(any(Pageable.class))).thenReturn(expected);

    mockMvc.perform(get(AUTHORITY_PATH))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.content").isArray())
           .andExpect(jsonPath("$.content", hasSize(1)))
           .andExpect(jsonPath("$.content..id", hasItem(authority.getId())));
  }

  @Nested
  class GetOneAuthorityTests {

    @Test
    void should_get_one_authority() throws Exception {
      AuthorityModel expected = AuthorityModel.builder()
                                              .id(randomUUID())
                                              .name("AUTH")
                                              .build();
      when(facade.findByAuthorityId(expected.getId())).thenReturn(expected);

      mockMvc.perform(get(AUTHORITY_PATH + "/" + expected.getId()))
             .andExpect(status().isOk())
             .andExpect(jsonPath("$.id", equalTo(expected.getId())));

    }

    @Test
    void get_one_authority_should_throw_if_id_does_not_exists() throws Exception {
      String notFoundId = randomUUID();
      doThrow(DomainEntityNotFoundException.class).when(facade)
                                                  .findByAuthorityId(notFoundId);

      mockMvc.perform(get(AUTHORITY_PATH + "/" + notFoundId))
             .andExpect(status().isNotFound());
    }
  }

  @TestConfiguration
  protected static class AuthorityControllerConfig {

    @Bean
    public AuthorityFacade AuthorityFacade() {
      return Mockito.mock(AuthorityFacade.class);
    }
  }
}
