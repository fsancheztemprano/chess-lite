package dev.kurama.api.ttt.move;


import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAME_MOVE_PATH;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAME_PATH;
import static dev.kurama.support.JsonUtils.asJsonString;
import static dev.kurama.support.TestConstant.MOCK_MVC_HOST;
import static dev.kurama.support.TestUtils.getAuthorizationHeader;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import dev.kurama.api.ttt.support.ImportTicTacToeMappers;
import dev.kurama.support.ImportTestSecurityConfiguration;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@ImportTestSecurityConfiguration
@WebMvcTest(controllers = TicTacToeGameMoveController.class)
@Import({TicTacToeGameMoveFacade.class, TicTacToeGameMoveModelAssembler.class})
@ImportTicTacToeMappers
class TicTacToeGameMoveControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @MockBean
  private TicTacToeGameMoveFacility facility;

  TicTacToeGame game = TicTacToeGame.builder()
    .setRandomUUID()
    .status(Status.IN_PROGRESS)
    .lastActivityAt(LocalDateTime.now())
    .requestedAt(LocalDateTime.now())
    .board("OX_____XO")
    .turn(Token.X)
    .build();
  TicTacToeGameMove move = TicTacToeGameMove.builder()
    .setRandomUUID()
    .game(game)
    .board("OX__X__XO")
    .cell("B2")
    .token(Token.X)
    .number(5)
    .movedAt(LocalDateTime.now())
    .moveTime(1000L)
    .build();

  @Nested
  class GetTicTacToeGameMovesITs {

    @Test
    void should_return_forbidden_without_authentication() throws Exception {
      mockMvc.perform(get(TIC_TAC_TOE_GAME_MOVE_PATH, randomUUID())).andExpect(status().isForbidden());
    }

    @Test
    void should_return_unauthorized_without_tic_tac_toe_game_move_read_authorization() throws Exception {
      mockMvc.perform(
          get(TIC_TAC_TOE_GAME_MOVE_PATH, randomUUID()).headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isUnauthorized());
    }

    @Test
    void should_get_tic_tac_toe_game_moves() throws Exception {
      doReturn(List.of(move)).when(facility).getAllGameMoves(move.getId());

      mockMvc.perform(get(TIC_TAC_TOE_GAME_MOVE_PATH, move.getId()).headers(
          getAuthorizationHeader(jwtTokenProvider, TicTacToeAuthority.TIC_TAC_TOE_ROOT)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._embedded.ticTacToeGameMoveModels.length()", equalTo(1)))
        .andExpect(jsonPath("$._embedded.ticTacToeGameMoveModels[0].id", equalTo(move.getId())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameMoveModels[0].board", equalTo(move.getBoard())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameMoveModels[0].cell", equalTo(move.getCell())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameMoveModels[0].token", equalTo(move.getToken().name())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameMoveModels[0].number", equalTo(move.getNumber())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameMoveModels[0].movedAt",
          equalTo(move.getMovedAt().toInstant(ZoneOffset.UTC).toEpochMilli())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameMoveModels[0].moveTime", equalTo(move.getMoveTime().intValue())))
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._links.self.href",
          equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAME_MOVE_PATH.replace("{gameId}", move.getId()))))
        .andExpect(jsonPath("$._links.game.href",
          equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAME_PATH.replace("{gameId}", move.getId()))));
    }
  }

  @Nested
  class CreateAMoveITs {

    @Test
    void should_return_forbidden_without_authentication() throws Exception {
      mockMvc.perform(get(TIC_TAC_TOE_GAME_MOVE_PATH, randomUUID())).andExpect(status().isForbidden());
    }

    @Test
    void should_return_unauthorized_without_tic_tac_toe_game_move_create_authorization() throws Exception {
      mockMvc.perform(
          get(TIC_TAC_TOE_GAME_MOVE_PATH, randomUUID()).headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isUnauthorized());
    }

    @Test
    void should_create_a_move() throws Exception {
      TicTacToeGameMoveInput input = TicTacToeGameMoveInput.builder().cell("B2").build();
      doReturn(move).when(facility).move(move.getId(), input);

      mockMvc.perform(post(TIC_TAC_TOE_GAME_MOVE_PATH, move.getId()).headers(
            getAuthorizationHeader(jwtTokenProvider, TicTacToeAuthority.TIC_TAC_TOE_ROOT))
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id", equalTo(move.getId())))
        .andExpect(jsonPath("$.board", equalTo(move.getBoard())))
        .andExpect(jsonPath("$.cell", equalTo(move.getCell())))
        .andExpect(jsonPath("$.token", equalTo(move.getToken().name())))
        .andExpect(jsonPath("$.number", equalTo(move.getNumber())))
        .andExpect(jsonPath("$.movedAt", equalTo(move.getMovedAt().toInstant(ZoneOffset.UTC).toEpochMilli())))
        .andExpect(jsonPath("$.moveTime", equalTo(move.getMoveTime().intValue())));
    }
  }
}
