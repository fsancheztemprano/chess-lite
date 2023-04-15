package dev.kurama.api.ttt.root;

import static dev.kurama.api.core.constant.RestPathConstant.BASE_PATH;
import static dev.kurama.api.ttt.core.TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE;
import static dev.kurama.api.ttt.core.TicTacToeAuthority.TIC_TAC_TOE_ROOT;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_BASE_PATH;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAMES_PATH;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_PLAYER_PATH;
import static dev.kurama.api.ttt.game.TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAMES_CHANGED_CHANNEL;
import static dev.kurama.api.ttt.game.TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL;
import static dev.kurama.support.TestConstant.MOCK_MVC_HOST;
import static java.lang.String.format;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.support.ImportTestSecurityConfiguration;
import dev.kurama.support.TestUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.MockMvc;

@ImportTestSecurityConfiguration
@WebMvcTest(controllers = TicTacToeRootController.class)
@Import(TicTacToeRootResourceAssembler.class)
class TicTacToeRootControllerIT {


  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @Test
  void should_get_forbidden_without_tic_tac_toe__root_authorization() throws Exception {
    mockMvc.perform(get(TIC_TAC_TOE_BASE_PATH)).andExpect(status().isForbidden());
  }

  @Test
  void should_get_tic_tac_toe_root() throws Exception {
    mockMvc.perform(get(TIC_TAC_TOE_BASE_PATH).accept(HAL_FORMS_JSON_VALUE)
        .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, TIC_TAC_TOE_ROOT)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$._links.*", hasSize(8)))
      .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_BASE_PATH)))
      .andExpect(jsonPath("$._links.root.href", equalTo(MOCK_MVC_HOST + BASE_PATH)))
      .andExpect(jsonPath("$._links.game.href", equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAMES_PATH + "/{gameId}")))
      .andExpect(jsonPath("$._links.games.href",
        equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAMES_PATH + "{?myGames,isPrivate,player,status,page,size,sort}")))
      .andExpect(jsonPath("$._links.games.templated", equalTo(true)))
      .andExpect(jsonPath("$._links.players.href", equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_PLAYER_PATH + "{?username}")))
      .andExpect(jsonPath("$._links.players.templated", equalTo(true)))
      .andExpect(jsonPath("$._links.create.href", equalTo(MOCK_MVC_HOST + TIC_TAC_TOE_GAMES_PATH)))
      .andExpect(jsonPath("$._links.ws:games.href", equalTo(TIC_TAC_TOE_GAMES_CHANGED_CHANNEL)))
      .andExpect(jsonPath("$._links.ws:game:player.href",
        equalTo(format(TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL, "{playerId}"))));
  }

  @Test
  void should_get_tic_tac_toe_root_create_template() throws Exception {
    mockMvc.perform(get(TIC_TAC_TOE_BASE_PATH).accept(HAL_FORMS_JSON_VALUE)
        .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, TIC_TAC_TOE_ROOT)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$._templates.*", hasSize(2)))
      .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
      .andExpect(jsonPath("$._templates.create.method", equalTo(HttpMethod.POST.toString())))
      .andExpect(jsonPath("$._templates.create.properties.*", hasSize(2)))
      .andExpect(jsonPath("$._templates.create.properties[0].name", equalTo("playerOUsername")))
      .andExpect(jsonPath("$._templates.create.properties[0].type", equalTo("text")))
      .andExpect(jsonPath("$._templates.create.properties[1].name", equalTo("isPrivate")))
      .andExpect(jsonPath("$._templates.create.properties[1].type", equalTo("boolean")));
  }

  @Test
  void should_get_tic_tac_toe_root_create_template_with_create_authority() throws Exception {
    mockMvc.perform(get(TIC_TAC_TOE_BASE_PATH).accept(HAL_FORMS_JSON_VALUE)
        .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, TIC_TAC_TOE_ROOT, TIC_TAC_TOE_GAME_CREATE)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$._templates.*", hasSize(2)))
      .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
      .andExpect(jsonPath("$._templates.create.method", equalTo(HttpMethod.POST.toString())))
      .andExpect(jsonPath("$._templates.create.properties.*", hasSize(3)))
      .andExpect(jsonPath("$._templates.create.properties[0].name", equalTo("playerOUsername")))
      .andExpect(jsonPath("$._templates.create.properties[0].type", equalTo("text")))
      .andExpect(jsonPath("$._templates.create.properties[1].name", equalTo("isPrivate")))
      .andExpect(jsonPath("$._templates.create.properties[1].type", equalTo("boolean")))
      .andExpect(jsonPath("$._templates.create.properties[2].name", equalTo("playerXUsername")))
      .andExpect(jsonPath("$._templates.create.properties[2].type", equalTo("text")));
  }

}
