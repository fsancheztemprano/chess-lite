package dev.kurama.api.ttt.player;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_PLAYER_PATH;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.MediaTypes;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {TicTacToePlayerController.class})
@Import(TicTacToePlayerControllerTest.TicTacToePlayerControllerConfig.class)
class TicTacToePlayerControllerTest {

  @Autowired
  private TicTacToePlayerController controller;

  @Autowired
  private TicTacToePlayerFacade facade;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller)
      .setControllerAdvice(new ExceptionHandlers())
      .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
      .build();
  }

  @Test
  void find_tick_tack_toe_player() throws Exception {
    TicTacToePlayerModel gameModel = TicTacToePlayerModel.builder().id(randomUUID()).username("user-1").build();
    when(facade.findPlayers(gameModel.getUsername())).thenReturn(CollectionModel.of(List.of(gameModel)));
    mockMvc.perform(
        get(TIC_TAC_TOE_PLAYER_PATH).param("username", gameModel.getUsername()).accept(MediaTypes.HAL_FORMS_JSON_VALUE))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content").isArray())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].id").value(gameModel.getId()))
      .andExpect(jsonPath("$.content[0].username").value(gameModel.getUsername()));
  }

  @TestConfiguration
  protected static class TicTacToePlayerControllerConfig {

    @Bean
    public TicTacToePlayerFacade TicTacToePlayerFacade() {
      return Mockito.mock(TicTacToePlayerFacade.class);
    }
  }
}
