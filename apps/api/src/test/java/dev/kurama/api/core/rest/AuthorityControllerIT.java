package dev.kurama.api.core.rest;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.authority.AuthorityAuthority.AUTHORITY_READ;
import static dev.kurama.api.core.constant.RestPathConstant.AUTHORITY_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
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
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.facade.AuthorityFacade;
import dev.kurama.api.core.hateoas.assembler.AuthorityModelAssembler;
import dev.kurama.api.core.hateoas.processor.AuthorityModelProcessor;
import dev.kurama.api.core.service.AuthorityService;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles(value = "integration-test")
@ImportTestSecurityConfiguration
@WebMvcTest(controllers = AuthorityController.class)
@Import({AuthorityFacade.class, AuthorityModelProcessor.class, AuthorityModelAssembler.class})
@ImportMappers
class AuthorityControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @MockBean
  private AuthorityService authorityService;

  @Nested
  class GetAllAuthoritiesITs {

    @Test
    void should_return_forbidden_without_authority_read_authorization() throws Exception {
      mockMvc.perform(get(AUTHORITY_PATH)).andExpect(status().isForbidden());

      mockMvc.perform(get(AUTHORITY_PATH).headers(TokenTestUtils.getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isForbidden());
    }

    @Test
    void should_get_all_authorities() throws Exception {
      ArrayList<Authority> authorities = newArrayList(Authority.builder().setRandomUUID().name(randomUUID()).build(),
        Authority.builder().setRandomUUID().name(randomUUID()).build());
      Page<Authority> expected = new PageImpl<Authority>(authorities, PageRequest.of(2, 2), 6);
      doReturn(expected).when(authorityService).getAllAuthorities(any());

      mockMvc.perform(get(AUTHORITY_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, AUTHORITY_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(4)))
        .andExpect(jsonPath("$._links..href", everyItem(startsWith(MOCK_MVC_HOST + AUTHORITY_PATH))))
        .andExpect(jsonPath("$._embedded.authorityModels", hasSize(2)))
        .andExpect(jsonPath("$._embedded.authorityModels[*].id",
          allOf(contains(authorities.get(0).getId(), authorities.get(1).getId()))))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }
  }

  @Nested
  class GetOneAuthorityITs {

    @Test
    void should_return_forbidden_without_authority_read_authorization() throws Exception {
      mockMvc.perform(get(AUTHORITY_PATH + "/authorityId")).andExpect(status().isForbidden());

      mockMvc.perform(get(AUTHORITY_PATH + "/authorityId").headers(
        TokenTestUtils.getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH"))).andExpect(status().isForbidden());
    }

    @Test
    void should_get_one_authority() throws Exception {
      Authority expected = Authority.builder().setRandomUUID().name(randomUUID()).build();
      doReturn(Optional.of(expected)).when(authorityService).findAuthorityById(expected.getId());

      mockMvc.perform(get(format("%s/%s", AUTHORITY_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, AUTHORITY_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$.name", equalTo(expected.getName())))
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(
          jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + format("%s/%s", AUTHORITY_PATH, expected.getId()))))
        .andExpect(jsonPath("$._links.authorities.href", equalTo(MOCK_MVC_HOST + AUTHORITY_PATH)))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }
  }
}
