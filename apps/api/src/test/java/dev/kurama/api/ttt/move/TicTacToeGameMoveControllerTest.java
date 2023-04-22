package dev.kurama.api.ttt.move;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAME_MOVE_PATH;
import static dev.kurama.support.JsonUtils.asJsonString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {TicTacToeGameMoveController.class})
@Import(TicTacToeGameMoveControllerTest.TicTacToeGameMoveControllerConfig.class)
class TicTacToeGameMoveControllerTest {

  @Autowired
  private TicTacToeGameMoveController controller;

  @Autowired
  private TicTacToeGameMoveFacade facade;

  private MockMvc mockMvc;


  TicTacToeGameMoveModel gameMoveModel = TicTacToeGameMoveModel.builder().id(randomUUID()).gameId(randomUUID()).build();

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller)
      .setControllerAdvice(new ExceptionHandlers())
      .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
      .build();
  }

  @Test
  void should_get_all_game_moves() throws Exception {
    when(facade.getAllGameMoves(gameMoveModel.getGameId())).thenReturn(CollectionModel.of(List.of(gameMoveModel)));

    mockMvc.perform(get(TIC_TAC_TOE_GAME_MOVE_PATH.replace("{gameId}", gameMoveModel.getGameId())).accept(
        MediaTypes.HAL_FORMS_JSON_VALUE))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content").isArray())
      .andExpect(jsonPath("$.content.length()").value(1))
      .andExpect(jsonPath("$.content[0].id").value(gameMoveModel.getId()));
  }

  @Test
  void should_create_game_move() throws Exception {
    var input = TicTacToeGameMoveInput.builder().cell("B2").build();

    when(facade.move(gameMoveModel.getGameId(), input)).thenReturn(gameMoveModel);

    mockMvc.perform(post(TIC_TAC_TOE_GAME_MOVE_PATH.replace("{gameId}", gameMoveModel.getGameId())).accept(
        MediaTypes.HAL_FORMS_JSON_VALUE).contentType(MediaType.APPLICATION_JSON).content(asJsonString(input)))
      .andExpect(status().isCreated())
      .andExpect(jsonPath("$.id").value(gameMoveModel.getId()));
  }


  @TestConfiguration
  protected static class TicTacToeGameMoveControllerConfig {

    @Bean
    public TicTacToeGameMoveFacade TicTacToeGameMoveFacade() {
      return Mockito.mock(TicTacToeGameMoveFacade.class);
    }
  }
}
