package dev.kurama.api.core.hateoas.root.rest;

import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.core.hateoas.root.processor.AdministrationRootResourceAssembler;
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
@ContextConfiguration(classes = {AdministrationRootController.class})
@Import(AdministrationRootControllerTest.AdministrationRootResourceAssemblerConfig.class)
class AdministrationRootControllerTest {

  @Autowired
  private AdministrationRootController controller;

  @Autowired
  private AdministrationRootResourceAssembler assembler;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller)
      .setControllerAdvice(new ExceptionHandlers())
      .build();
  }

  @Test
  void should_get_AdministrationRoot_resource_as_unauthenticated_user() throws Exception {
    RepresentationModel AdministrationRootResource = mock(RepresentationModel.class);
    doReturn(AdministrationRootResource).when(assembler)
      .assemble();

    mockMvc.perform(get("/api/administration"))
      .andExpect(status().isOk());
  }

  @TestConfiguration
  protected static class AdministrationRootResourceAssemblerConfig {

    @Bean
    public AdministrationRootResourceAssembler AdministrationRootResourceAssembler() {
      return mock(AdministrationRootResourceAssembler.class);
    }
  }
}
