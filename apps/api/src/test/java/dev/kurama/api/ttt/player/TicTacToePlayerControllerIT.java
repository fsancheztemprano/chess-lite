package dev.kurama.api.ttt.player;

import static dev.kurama.api.ttt.core.TicTacToeAuthority.TIC_TAC_TOE_ROOT;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_PLAYER_PATH;
import static dev.kurama.support.TestUtils.getAuthorizationHeader;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.when;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.api.ttt.support.ImportTicTacToeMappers;
import dev.kurama.support.ImportTestSecurityConfiguration;
import java.util.List;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@ImportTestSecurityConfiguration
@WebMvcTest(controllers = TicTacToePlayerController.class)
@Import({TicTacToePlayerFacade.class, TicTacToePlayerModelAssembler.class})
@ImportTicTacToeMappers
class TicTacToePlayerControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @MockBean
  private TicTacToePlayerService service;

  @Nested
  class FindTicTacToePlayerITs {

    @Test
    void should_return_forbidden_without_authentication() throws Exception {
      mockMvc.perform(get(TIC_TAC_TOE_PLAYER_PATH).param("username", randomAlphanumeric(10)))
        .andExpect(status().isForbidden());
    }

    @Test
    void should_return_unauthorized_without_tic_tac_toe_root_authority() throws Exception {
      mockMvc.perform(get(TIC_TAC_TOE_PLAYER_PATH).param("username", randomAlphanumeric(10))
        .accept(HAL_FORMS_JSON_VALUE)
        .headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH"))).andExpect(status().isUnauthorized());
    }

    @Test
    void should_return_player_matches_with_tic_tac_toe_root_authority() throws Exception {
      String username = "username";
      TicTacToePlayer playerX = TicTacToePlayer.builder()
        .setRandomUUID()
        .username(username + "-" + randomAlphanumeric(10))
        .build();
      TicTacToePlayer playerO = TicTacToePlayer.builder()
        .setRandomUUID()
        .username(username + "-" + randomAlphanumeric(10))
        .build();
      when(service.findPlayers(username)).thenReturn(List.of(playerX, playerO));

      mockMvc.perform(get(TIC_TAC_TOE_PLAYER_PATH).param("username", username)
          .accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, TIC_TAC_TOE_ROOT)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._embedded.ticTacToePlayerModels[0].username", equalTo(playerX.getUsername())))
        .andExpect(jsonPath("$._embedded.ticTacToePlayerModels[1].username", equalTo(playerO.getUsername())));
    }
  }
}
