package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAMES_PATH;
import static dev.kurama.support.JsonUtils.asJsonString;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.ttt.game.input.TicTacToeGameFilterInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameStatusInput;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.hateoas.MediaTypes;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.PagedModel.PageMetadata;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {TicTacToeGameController.class})
@Import(TicTacToeGameControllerTest.TicTacToeGameControllerConfig.class)
class TicTacToeGameControllerTest {


  @Autowired
  private TicTacToeGameController controller;

  @Autowired
  private TicTacToeGameFacade facade;

  private MockMvc mockMvc;

  private TicTacToeGameModel gameModel;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller)
      .setControllerAdvice(new ExceptionHandlers())
      .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
      .build();
    gameModel = TicTacToeGameModel.builder().id(randomUUID()).board("_X_O____").build();
  }

  @Test
  void should_create_a_new_tic_tac_toe_game() throws Exception {
    when(facade.create(any(TicTacToeGameInput.class))).thenReturn(gameModel);
    TicTacToeGameInput input = TicTacToeGameInput.builder().playerOUsername("user-1").build();

    mockMvc.perform(post(TIC_TAC_TOE_GAMES_PATH).accept(MediaTypes.HAL_FORMS_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input)))
      .andExpect(status().isCreated())
      .andExpect(jsonPath("$.id").value(gameModel.getId()))
      .andExpect(jsonPath("$.board").value(gameModel.getBoard()));
  }

  @Test
  void should_get_all_tic_tac_toe_games() throws Exception {
    PagedModel<TicTacToeGameModel> pagedModel = PagedModel.of(List.of(gameModel), new PageMetadata(1, 0, 1));
    when(facade.getAll(any(Pageable.class), any(TicTacToeGameFilterInput.class))).thenReturn(pagedModel);
    mockMvc.perform(get(TIC_TAC_TOE_GAMES_PATH).accept(MediaTypes.HAL_FORMS_JSON_VALUE))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.content").isArray())
      .andExpect(jsonPath("$.content", hasSize(1)))
      .andExpect(jsonPath("$.content..id", hasItem(gameModel.getId())));
  }

  @Test
  void should_get_a_tic_tac_toe_game() throws Exception {
    when(facade.findById(gameModel.getId())).thenReturn(gameModel);
    mockMvc.perform(get(TIC_TAC_TOE_GAMES_PATH + "/" + gameModel.getId()).accept(MediaTypes.HAL_FORMS_JSON_VALUE))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.id").value(gameModel.getId()))
      .andExpect(jsonPath("$.board").value(gameModel.getBoard()));
  }

  @Test
  void should_update_game_status() throws Exception {
    TicTacToeGameStatusInput input = TicTacToeGameStatusInput.builder().status("X").build();
    when(facade.updateStatus(gameModel.getId(), input)).thenReturn(gameModel);
    mockMvc.perform(patch(TIC_TAC_TOE_GAMES_PATH + "/" + gameModel.getId()).accept(MediaTypes.HAL_FORMS_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.id").value(gameModel.getId()))
      .andExpect(jsonPath("$.board").value(gameModel.getBoard()));
  }

  @TestConfiguration
  protected static class TicTacToeGameControllerConfig {

    @Bean
    public TicTacToeGameFacade TicTacToeGameFacade() {
      return Mockito.mock(TicTacToeGameFacade.class);
    }
  }

}
