package dev.kurama.api.core.hateoas.root.rest;

import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.core.hateoas.root.processor.RootResourceAssembler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {RootController.class})
@Import(RootControllerTest.RootResourceAssemblerConfig.class)
class RootControllerTest {

  @Autowired
  private RootController controller;

  @Autowired
  private RootResourceAssembler assembler;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller)
      .setControllerAdvice(new ExceptionHandlers())
      .build();
  }

  @Test
  void should_get_root_resource_as_unauthenticated_user() throws Exception {
    RepresentationModel rootResource = mock(RepresentationModel.class);
    doReturn(rootResource).when(assembler)
      .assemble();

    mockMvc.perform(get("/api"))
      .andExpect(status().isOk());
  }

  @TestConfiguration
  protected static class RootResourceAssemblerConfig {

    @Bean
    public RootResourceAssembler rootResourceAssembler() {
      return mock(RootResourceAssembler.class);
    }
  }
}
