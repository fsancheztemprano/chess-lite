package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_BASE_PATH;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.util.Lists.newArrayList;
import static org.springframework.data.domain.PageRequest.of;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;
import static org.springframework.web.util.UriComponentsBuilder.fromUriString;

import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpMethod;
import org.springframework.web.util.UriComponents;

class TicTacToeGameModelAssemblerTest {

  private TicTacToeGameModelAssembler ticTacToeGameModelAssembler;

  private static final UriComponents baseUri = fromUriString(TIC_TAC_TOE_BASE_PATH).build();

  @BeforeEach
  void setUp() {
    ticTacToeGameModelAssembler = new TicTacToeGameModelAssembler();
    ticTacToeGameModelAssembler.setPagedResourcesAssembler(
      new PagedResourcesAssembler<>(new HateoasPageableHandlerMethodArgumentResolver(), baseUri));
  }

  @Test
  void should_map_to_paged_model_and_add_links() {
    TicTacToeGameModel game = TicTacToeGameModel.builder().id(randomUUID()).status(Status.PENDING).build();
    PageImpl<TicTacToeGameModel> pagedGames = new PageImpl<>(newArrayList(game), of(2, 2), 10);

    PagedModel<TicTacToeGameModel> actual = ticTacToeGameModelAssembler.toPagedModel(pagedGames);

    assertThat(actual.getContent()).hasSize(1)
      .extracting("id")
      .anySatisfy(id -> assertThat(id).isEqualTo(game.getId()));
    assertThat(actual.getLinks()).hasSize(5);
    assertThat(actual.getLink(SELF)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).startsWith(baseUri.toString()));

    assertThat(actual.getLinks()).extracting("rel")
      .anySatisfy(name -> assertThat(name).hasToString("first"))
      .anySatisfy(name -> assertThat(name).hasToString("last"))
      .anySatisfy(name -> assertThat(name).hasToString("prev"))
      .anySatisfy(name -> assertThat(name).hasToString("next"));
  }

  @Test
  void should_map_to_paged_model_and_add_affordances() {
    TicTacToeGameModel game = TicTacToeGameModel.builder().id(randomUUID()).status(Status.PENDING).build();
    PageImpl<TicTacToeGameModel> pagedGames = new PageImpl<>(newArrayList(game), of(2, 2), 10);

    PagedModel<TicTacToeGameModel> actual = ticTacToeGameModelAssembler.toPagedModel(pagedGames);

    assertThat(actual.getRequiredLink(SELF).getAffordances()).hasSize(1)
      .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
      .extracting("name", "httpMethod")
      .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD));
  }


}
