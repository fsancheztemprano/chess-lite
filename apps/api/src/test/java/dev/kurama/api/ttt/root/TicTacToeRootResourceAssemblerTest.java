package dev.kurama.api.ttt.root;

import static dev.kurama.api.core.constant.RestPathConstant.BASE_PATH;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.ROOT_REL;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.ttt.core.TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_BASE_PATH;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAMES_PATH;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_PLAYER_PATH;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_CREATE_REL;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_GAMES_REL;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_GAME_REL;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_PLAYERS_REL;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_WS_GAMES;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_WS_GAME_PLAYER;
import static dev.kurama.api.ttt.game.TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAMES_CHANGED_CHANNEL;
import static dev.kurama.api.ttt.game.TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

import dev.kurama.api.core.filter.ContextUser;
import dev.kurama.api.core.utility.AuthorityUtils;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.AffordanceModel;
import org.springframework.hateoas.AffordanceModel.PropertyMetadata;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.http.HttpMethod;

class TicTacToeRootResourceAssemblerTest {

  private TicTacToeRootResourceAssembler ticTacToeRootResourceAssembler;

  @BeforeEach
  void setUp() {
    ticTacToeRootResourceAssembler = new TicTacToeRootResourceAssembler(
      new HateoasPageableHandlerMethodArgumentResolver());
  }

  @Test
  void should_have_self_link() {
    RepresentationModel<?> actual = ticTacToeRootResourceAssembler.assemble();
    assertThat(actual.getLinks()).hasSize(8);
    assertThat(actual.getLink(SELF)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(TIC_TAC_TOE_BASE_PATH));
  }

  @Test
  void should_have_root_link() {
    RepresentationModel<?> actual = ticTacToeRootResourceAssembler.assemble();
    assertThat(actual.getLink(ROOT_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(BASE_PATH));
  }

  @Test
  void should_have_games_link() {
    RepresentationModel<?> actual = ticTacToeRootResourceAssembler.assemble();
    assertThat(actual.getLink(TIC_TAC_TOE_GAMES_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(
        TIC_TAC_TOE_GAMES_PATH + "{?myGames,isPrivate,player,status,page,size,sort}"));
  }

  @Test
  void should_have_game_link() {
    RepresentationModel<?> actual = ticTacToeRootResourceAssembler.assemble();
    assertThat(actual.getLink(TIC_TAC_TOE_GAME_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(TIC_TAC_TOE_GAMES_PATH + "/{gameId}"));
  }

  @Test
  void should_have_players_link() {
    RepresentationModel<?> actual = ticTacToeRootResourceAssembler.assemble();
    assertThat(actual.getLink(TIC_TAC_TOE_PLAYERS_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(TIC_TAC_TOE_PLAYER_PATH + "{?username}"));
  }

  @Test
  void should_have_games_changed_channel_link() {
    RepresentationModel<?> actual = ticTacToeRootResourceAssembler.assemble();
    assertThat(actual.getLink(TIC_TAC_TOE_WS_GAMES)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(TIC_TAC_TOE_GAMES_CHANGED_CHANNEL));
  }

  @Test
  void should_have_game_player_changed_channel_link() {
    RepresentationModel<?> actual = ticTacToeRootResourceAssembler.assemble();
    assertThat(actual.getLink(TIC_TAC_TOE_WS_GAME_PLAYER)).isPresent()
      .hasValueSatisfying(
        link -> assertThat(link.getHref()).isEqualTo(format(TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL, "{playerId}")));
  }

  @Test
  void should_have_create_link() {
    RepresentationModel<?> actual = ticTacToeRootResourceAssembler.assemble();
    assertThat(actual.getLink(TIC_TAC_TOE_CREATE_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(TIC_TAC_TOE_GAMES_PATH));
  }

  @Test
  void should_have_create_affordance() {
    RepresentationModel<?> actual = ticTacToeRootResourceAssembler.assemble();
    List<Affordance> affordances = actual.getRequiredLink(TIC_TAC_TOE_CREATE_REL).getAffordances();
    assertThat(affordances).hasSize(2);

    AffordanceModel create = affordances.get(1).getAffordanceModel(HAL_FORMS_JSON);

    assertThat(create.getName()).isEqualTo(TIC_TAC_TOE_CREATE_REL);
    assertThat(create.getHttpMethod()).isEqualTo(HttpMethod.POST);
    assertThat(create.getURI()).isEqualTo(TIC_TAC_TOE_GAMES_PATH);
    assertThat(create.getInput().stream()).hasSize(2);

    List<PropertyMetadata> input = create.getInput().stream().toList();
    assertThat(input.get(0).getName()).isEqualTo("playerOUsername");
    assertThat(input.get(0).isRequired()).isTrue();
    assertThat(input.get(1).getName()).isEqualTo("isPrivate");
    assertThat(input.get(1).isRequired()).isFalse();
  }

  @Test
  void should_have_create_affordance_with_player_o_username_with_game_create_auth() {
    AuthorityUtils.setContextUser(ContextUser.builder().build(), TIC_TAC_TOE_GAME_CREATE);
    RepresentationModel<?> actual = ticTacToeRootResourceAssembler.assemble();
    List<Affordance> affordances = actual.getRequiredLink(TIC_TAC_TOE_CREATE_REL).getAffordances();
    assertThat(affordances).hasSize(2);

    AffordanceModel create = affordances.get(1).getAffordanceModel(HAL_FORMS_JSON);

    assertThat(create.getName()).isEqualTo(TIC_TAC_TOE_CREATE_REL);
    assertThat(create.getHttpMethod()).isEqualTo(HttpMethod.POST);
    assertThat(create.getURI()).isEqualTo(TIC_TAC_TOE_GAMES_PATH);
    assertThat(create.getInput().stream()).hasSize(3);

    List<PropertyMetadata> input = create.getInput().stream().toList();
    assertThat(input.get(0).getName()).isEqualTo("playerOUsername");
    assertThat(input.get(0).isRequired()).isTrue();
    assertThat(input.get(1).getName()).isEqualTo("isPrivate");
    assertThat(input.get(1).isRequired()).isFalse();
    assertThat(input.get(2).getName()).isEqualTo("playerXUsername");
    assertThat(input.get(2).isRequired()).isFalse();
  }
}
