package dev.kurama.api.core.configuration.development.halexplorer;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {HalExplorerRedirection.class})
@ActiveProfiles(profiles = "development")
class HalExplorerRedirectionTest {

  @Autowired
  private HalExplorerRedirection controller;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }

  @Test
  void should_redirect_to_hal_explorer() throws Exception {
    mockMvc.perform(get("/explorer"))
      .andExpect(status().is3xxRedirection())
      .andExpect(redirectedUrl("/explorer/index.html#uri=/api"));
  }
}
