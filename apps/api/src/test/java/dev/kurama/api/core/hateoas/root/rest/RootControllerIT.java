package dev.kurama.api.core.hateoas.root.rest;

import static dev.kurama.api.core.constant.RestPathConstant.BASE_PATH;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.hateoas.root.processor.RootResourceAssembler;
import dev.kurama.api.support.ImportTestSecurityConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

@ActiveProfiles(value = "integration-test")
@ImportTestSecurityConfiguration
@WebMvcTest(controllers = RootController.class)
@Import(RootResourceAssembler.class)
class RootControllerIT {

  @Autowired
  private MockMvc mockMvc;


  @Test
  void should_get_root_resource_for_unauthenticated_user() throws Exception {
    ResultActions resultActions = mockMvc.perform(
        get(BASE_PATH))
      .andExpect(status().isOk())
//      .andExpect(jsonPath("$._links", equalTo("")))
      ;

    System.out.println(resultActions);
  }
}

