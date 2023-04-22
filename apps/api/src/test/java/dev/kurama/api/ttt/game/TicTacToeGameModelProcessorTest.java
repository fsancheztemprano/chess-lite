package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.WEBSOCKET_REL;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.ttt.core.TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE;
import static dev.kurama.api.ttt.core.TicTacToeAuthority.TIC_TAC_TOE_GAME_MOVE;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_MOVES_REL;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_MOVE_REL;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_STATUS_REL;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

import dev.kurama.api.core.filter.ContextUser;
import dev.kurama.api.core.utility.AuthorityUtils;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import dev.kurama.api.ttt.player.TicTacToePlayerModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;

@ExtendWith(MockitoExtension.class)
class TicTacToeGameModelProcessorTest {

  @InjectMocks
  private TicTacToeGameModelProcessor processor;

  private TicTacToeGameModel model;

  @BeforeEach
  void setUp() {
    model = TicTacToeGameModel.builder()
      .id(randomUUID())
      .status(Status.REJECTED)
      .turn(Token.X)
      .playerX(TicTacToePlayerModel.builder().id(randomUUID()).username(randomUUID()).build())
      .playerO(TicTacToePlayerModel.builder().id(randomUUID()).username(randomUUID()).build())
      .board("_________")
      .build();
    AuthorityUtils.setContextUser(ContextUser.builder().id(randomUUID()).username(randomUUID()).build());
  }

  @Test
  void should_have_tic_tac_toe_game_links() {
    TicTacToeGameModel actual = processor.process(model);

    assertThat(actual.getLinks()).hasSize(2);
    assertThat(actual.getLink(SELF)).isPresent()
      .hasValueSatisfying(
        link -> assertThat(link.getHref()).isEqualTo(format("/api/tic-tac-toe/game/%s", model.getId())));
    assertThat(actual.getLink(WEBSOCKET_REL)).isPresent()
      .hasValueSatisfying(
        link -> assertThat(link.getHref()).isEqualTo(format("/ami/tic-tac-toe/game/%s", model.getId())));
    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(2)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains("get", HttpMethod.GET));
  }

  @Test
  void should_have_template_to_update_status_if_pending_and_player_o_is_current_user() {
    AuthorityUtils.setContextUser(
      ContextUser.builder().id(model.getPlayerO().getId()).username(model.getPlayerO().getUsername()).build());
    model.setStatus(Status.PENDING);
    TicTacToeGameModel actual = processor.process(model);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(3)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(TIC_TAC_TOE_STATUS_REL, HttpMethod.PATCH));
  }

  @Test
  void should_have_template_to_update_status_if_current_user_has_game_create_authority() {
    AuthorityUtils.setContextUser(ContextUser.builder().id(randomUUID()).username(randomUUID()).build(),
      TIC_TAC_TOE_GAME_CREATE);
    model.setStatus(Status.PENDING);
    TicTacToeGameModel actual = processor.process(model);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(3)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(TIC_TAC_TOE_STATUS_REL, HttpMethod.PATCH));
  }

  @Test
  void should_have_moves_link_when_in_progress() {
    model.setStatus(Status.IN_PROGRESS);
    TicTacToeGameModel actual = processor.process(model);

    assertThat(actual.getLinks()).hasSize(3);
    assertThat(actual.getLink(TIC_TAC_TOE_MOVES_REL)).isPresent()
      .hasValueSatisfying(
        link -> assertThat(link.getHref()).isEqualTo(format("/api/tic-tac-toe/game/%s/move", model.getId())));
  }


  @Test
  void should_have_moves_link_when_finished() {
    model.setStatus(Status.FINISHED);
    TicTacToeGameModel actual = processor.process(model);

    assertThat(actual.getLinks()).hasSize(3);
    assertThat(actual.getLink(TIC_TAC_TOE_MOVES_REL)).isPresent()
      .hasValueSatisfying(
        link -> assertThat(link.getHref()).isEqualTo(format("/api/tic-tac-toe/game/%s/move", model.getId())));
  }

  @Test
  void should_have_template_to_move_when_in_progress_and_turn_of_current_user() {
    model.setStatus(Status.IN_PROGRESS);
    model.setTurn(Token.X);
    AuthorityUtils.setContextUser(
      ContextUser.builder().id(model.getPlayerX().getId()).username(model.getPlayerX().getUsername()).build());
    TicTacToeGameModel actual = processor.process(model);

    assertThat(actual.getRequiredLink(TIC_TAC_TOE_MOVES_REL).getAffordances()).hasSize(2)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(TIC_TAC_TOE_MOVE_REL, HttpMethod.POST));
  }


  @Test
  void should_have_template_to_move_if_current_user_has_game_move_authority() {
    model.setStatus(Status.IN_PROGRESS);
    model.setTurn(Token.X);
    AuthorityUtils.setContextUser(ContextUser.builder().id(randomUUID()).username(randomUUID()).build(),
      TIC_TAC_TOE_GAME_MOVE);
    TicTacToeGameModel actual = processor.process(model);

    assertThat(actual.getRequiredLink(TIC_TAC_TOE_MOVES_REL).getAffordances()).hasSize(2)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(TIC_TAC_TOE_MOVE_REL, HttpMethod.POST));
  }

}
