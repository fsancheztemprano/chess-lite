package dev.kurama.api.ttt.game;

import static dev.kurama.api.ttt.core.TicTacToeAuthority.TIC_TAC_TOE_ROOT;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAMES_PATH;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAME_MOVE_PATH;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAME_PATH;
import static dev.kurama.api.ttt.game.TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_CHANGED_CHANNEL;
import static dev.kurama.support.JsonUtils.asJsonString;
import static dev.kurama.support.TestConstant.MOCK_MVC_HOST;
import static dev.kurama.support.TestUtils.getAuthorizationHeader;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.input.TicTacToeGameFilterInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameStatusInput;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import dev.kurama.api.ttt.support.ImportTicTacToeMappers;
import dev.kurama.support.ImportTestSecurityConfiguration;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@ImportTestSecurityConfiguration
@WebMvcTest(controllers = TicTacToeGameController.class)
@Import({TicTacToeGameFacade.class, TicTacToeGameModelAssembler.class, TicTacToeGameModelProcessor.class})
@ImportTicTacToeMappers()
class TicTacToeGameControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @MockBean
  private TicTacToeGameService service;

  TicTacToePlayer playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
  TicTacToePlayer playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();
  TicTacToeGame game = TicTacToeGame.builder()
    .setRandomUUID()
    .playerX(playerX)
    .playerO(playerO)
    .status(Status.IN_PROGRESS)
    .lastActivityAt(LocalDateTime.now())
    .requestedAt(LocalDateTime.now())
    .board("OX_____XO")
    .turn(Token.X)
    .build();

  @Nested
  class CreateTicTacToeGameITs {

    TicTacToeGameInput input = TicTacToeGameInput.builder().playerOUsername("playerO").build();

    @Test
    void should_return_forbidden_when_user_is_not_authenticated() throws Exception {
      mockMvc.perform(post(TIC_TAC_TOE_GAMES_PATH).contentType(MediaType.APPLICATION_JSON).content(asJsonString(input)))
        .andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    void should_return_unauthorized_when_user_is_not_authorized() throws Exception {
      mockMvc.perform(post(TIC_TAC_TOE_GAMES_PATH).contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))
          .headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    void should_return_created_when_user_is_authorized() throws Exception {
      when(service.create(input)).thenReturn(game);

      mockMvc.perform(post(TIC_TAC_TOE_GAMES_PATH).contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))
          .headers(getAuthorizationHeader(jwtTokenProvider, TIC_TAC_TOE_ROOT)))
        .andExpect(MockMvcResultMatchers.status().isCreated())
        .andExpect(jsonPath("$.id", equalTo(game.getId())))
        .andExpect(jsonPath("$.playerX.id", equalTo(game.getPlayerX().getId())))
        .andExpect(jsonPath("$.playerX.username", equalTo(game.getPlayerX().getUsername())))
        .andExpect(jsonPath("$.playerO.id", equalTo(game.getPlayerO().getId())))
        .andExpect(jsonPath("$.playerO.username", equalTo(game.getPlayerO().getUsername())))
        .andExpect(jsonPath("$.status", equalTo(game.getStatus().name())))
        .andExpect(jsonPath("$.board", equalTo(game.getBoard())))
        .andExpect(jsonPath("$.turn", equalTo(game.getTurn().name())))
        .andExpect(jsonPath("$._links.*", hasSize(3)))
        .andExpect(jsonPath("$._links.self.href",
          equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAME_PATH.replace("{gameId}", game.getId()))))
        .andExpect(jsonPath("$._links.moves.href",
          equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAME_MOVE_PATH.replace("{gameId}", game.getId()))))
        .andExpect(jsonPath("$._links.ws.href", equalTo(TIC_TAC_TOE_GAME_CHANGED_CHANNEL.formatted(game.getId()))));
    }
  }

  @Nested
  class GetTicTacToeGameITs {

    @Test
    void should_return_forbidden_when_user_is_not_authenticated() throws Exception {
      mockMvc.perform(get(TIC_TAC_TOE_GAME_PATH, game.getId())).andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    void should_return_unauthorized_when_user_is_not_authorized() throws Exception {
      mockMvc.perform(
          get(TIC_TAC_TOE_GAME_PATH, game.getId()).headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    void should_return_ok_when_user_is_authorized() throws Exception {
      when(service.findById(game.getId())).thenReturn(game);

      mockMvc.perform(
          get(TIC_TAC_TOE_GAME_PATH, game.getId()).headers(getAuthorizationHeader(jwtTokenProvider, TIC_TAC_TOE_ROOT)))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(jsonPath("$.id", equalTo(game.getId())))
        .andExpect(jsonPath("$.playerX.id", equalTo(game.getPlayerX().getId())))
        .andExpect(jsonPath("$.playerX.username", equalTo(game.getPlayerX().getUsername())))
        .andExpect(jsonPath("$.playerO.id", equalTo(game.getPlayerO().getId())))
        .andExpect(jsonPath("$.playerO.username", equalTo(game.getPlayerO().getUsername())))
        .andExpect(jsonPath("$.status", equalTo(game.getStatus().name())))
        .andExpect(jsonPath("$.board", equalTo(game.getBoard())))
        .andExpect(jsonPath("$.turn", equalTo(game.getTurn().name())))
        .andExpect(jsonPath("$._links.*", hasSize(3)))
        .andExpect(jsonPath("$._links.self.href",
          equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAME_PATH.replace("{gameId}", game.getId()))))
        .andExpect(jsonPath("$._links.moves.href",
          equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAME_MOVE_PATH.replace("{gameId}", game.getId()))))
        .andExpect(jsonPath("$._links.ws.href", equalTo(TIC_TAC_TOE_GAME_CHANGED_CHANNEL.formatted(game.getId()))));
    }
  }

  @Nested
  class UpdateTicTacToeGameStatusITs {

    TicTacToeGameStatusInput input = TicTacToeGameStatusInput.builder().status(Status.IN_PROGRESS.name()).build();

    @Test
    void should_return_forbidden_when_user_is_not_authenticated() throws Exception {
      mockMvc.perform(
          patch(TIC_TAC_TOE_GAME_PATH, game.getId()).contentType(MediaType.APPLICATION_JSON).content(asJsonString(input)))
        .andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    void should_return_unauthorized_when_user_is_not_authorized() throws Exception {
      mockMvc.perform(patch(TIC_TAC_TOE_GAME_PATH, game.getId()).contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))
          .headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    void should_return_ok_when_user_is_authorized() throws Exception {
      when(service.updateStatus(game.getId(), input)).thenReturn(game);

      mockMvc.perform(patch(TIC_TAC_TOE_GAME_PATH, game.getId()).contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))
          .headers(getAuthorizationHeader(jwtTokenProvider, TIC_TAC_TOE_ROOT)))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(jsonPath("$.id", equalTo(game.getId())))
        .andExpect(jsonPath("$.playerX.id", equalTo(game.getPlayerX().getId())))
        .andExpect(jsonPath("$.playerX.username", equalTo(game.getPlayerX().getUsername())))
        .andExpect(jsonPath("$.playerO.id", equalTo(game.getPlayerO().getId())))
        .andExpect(jsonPath("$.playerO.username", equalTo(game.getPlayerO().getUsername())))
        .andExpect(jsonPath("$.status", equalTo(game.getStatus().name())))
        .andExpect(jsonPath("$.board", equalTo(game.getBoard())))
        .andExpect(jsonPath("$.turn", equalTo(game.getTurn().name())))
        .andExpect(jsonPath("$._links.*", hasSize(3)))
        .andExpect(jsonPath("$._links.self.href",
          equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAME_PATH.replace("{gameId}", game.getId()))))
        .andExpect(jsonPath("$._links.moves.href",
          equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAME_MOVE_PATH.replace("{gameId}", game.getId()))))
        .andExpect(jsonPath("$._links.ws.href", equalTo(TIC_TAC_TOE_GAME_CHANGED_CHANNEL.formatted(game.getId()))));
    }
  }

  @Nested
  class GetAllTicTacToeGamesITs {

    TicTacToeGameFilterInput filter = TicTacToeGameFilterInput.builder().myGames(false).isPrivate(false).build();

    PageImpl<TicTacToeGame> page = new PageImpl<>(List.of(game));

    @Test
    void should_return_forbidden_when_user_is_not_authenticated() throws Exception {
      mockMvc.perform(get(TIC_TAC_TOE_GAMES_PATH)).andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    void should_return_unauthorized_when_user_is_not_authorized() throws Exception {
      mockMvc.perform(get(TIC_TAC_TOE_GAMES_PATH).headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    void should_return_ok_when_user_is_authorized() throws Exception {
      when(service.getAll(any(), eq(filter))).thenReturn(page);

      mockMvc.perform(get(TIC_TAC_TOE_GAMES_PATH).headers(getAuthorizationHeader(jwtTokenProvider, TIC_TAC_TOE_ROOT))
          .queryParam("myGames", filter.getMyGames().toString())
          .param("isPrivate", filter.getIsPrivate().toString()))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(jsonPath("$._embedded.ticTacToeGameModels", hasSize(1)))
        .andExpect(jsonPath("$._embedded.ticTacToeGameModels[0].id", equalTo(game.getId())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameModels[0].playerX.id", equalTo(game.getPlayerX().getId())))
        .andExpect(
          jsonPath("$._embedded.ticTacToeGameModels[0].playerX.username", equalTo(game.getPlayerX().getUsername())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameModels[0].playerO.id", equalTo(game.getPlayerO().getId())))
        .andExpect(
          jsonPath("$._embedded.ticTacToeGameModels[0].playerO.username", equalTo(game.getPlayerO().getUsername())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameModels[0].status", equalTo(game.getStatus().name())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameModels[0].board", equalTo(game.getBoard())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameModels[0].turn", equalTo(game.getTurn().name())))
        .andExpect(jsonPath("$._embedded.ticTacToeGameModels[0]._links.*", hasSize(3)))
        .andExpect(jsonPath("$._embedded.ticTacToeGameModels[0]._links.self.href",
          equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAME_PATH.replace("{gameId}", game.getId()))))
        .andExpect(jsonPath("$._embedded.ticTacToeGameModels[0]._links.moves.href",
          equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAME_MOVE_PATH.replace("{gameId}", game.getId()))))
        .andExpect(jsonPath("$._embedded.ticTacToeGameModels[0]._links.ws.href",
          equalTo(TIC_TAC_TOE_GAME_CHANGED_CHANNEL.formatted(game.getId()))))
        .andExpect(jsonPath("$._links.*", hasSize(1)))
        .andExpect(jsonPath("$._links.self.href", startsWith(MOCK_MVC_HOST + TIC_TAC_TOE_GAMES_PATH)))
        .andExpect(jsonPath("$.page.size", equalTo(1)))
        .andExpect(jsonPath("$.page.totalElements", equalTo(1)))
        .andExpect(jsonPath("$.page.totalPages", equalTo(1)))
        .andExpect(jsonPath("$.page.number", equalTo(0)));
    }
  }
}
