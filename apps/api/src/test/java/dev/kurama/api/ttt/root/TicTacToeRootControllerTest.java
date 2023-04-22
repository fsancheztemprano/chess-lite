package dev.kurama.api.ttt.root;

import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_BASE_PATH;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
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

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {TicTacToeRootController.class})
@Import(TicTacToeRootControllerTest.TicTacToeRootResourceAssemblerConfig.class)
class TicTacToeRootControllerTest {

  @Autowired
  private TicTacToeRootController controller;

  @Autowired
  private TicTacToeRootResourceAssembler assembler;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new ExceptionHandlers()).build();
  }

  @Test
  void should_get_root_tic_tac_toe_resource() throws Exception {
    RepresentationModel<?> rootResource = mock(RepresentationModel.class);
    doReturn(rootResource).when(assembler).assemble();

    mockMvc.perform(get(TIC_TAC_TOE_BASE_PATH)).andExpect(status().isOk());
  }

  @TestConfiguration
  protected static class TicTacToeRootResourceAssemblerConfig {

    @Bean
    public TicTacToeRootResourceAssembler TicTacToeRootResourceAssembler() {
      return mock(TicTacToeRootResourceAssembler.class);
    }
  }
}
