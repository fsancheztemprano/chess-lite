package dev.kurama.api.ttt.move;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAMES_PATH;
import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAME_MOVE_PATH;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_GAME_REL;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.util.Lists.newArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.hateoas.CollectionModel;

class TicTacToeGameMoveModelAssemblerTest {

  private TicTacToeGameMoveModelAssembler assembler;


  @BeforeEach
  void setUp() {
    assembler = new TicTacToeGameMoveModelAssembler();
  }

  @Test
  void should_get_game_moves_collection_models_with_links() {
    TicTacToeGameMoveModel move1 = TicTacToeGameMoveModel.builder().id(randomUUID()).gameId(randomUUID()).build();
    TicTacToeGameMoveModel move2 = TicTacToeGameMoveModel.builder().id(randomUUID()).gameId(randomUUID()).build();

    CollectionModel<TicTacToeGameMoveModel> actual = assembler.toCollectionModel(newArrayList(move1, move2), "game-id");

    assertThat(actual.getContent()).hasSize(2)
      .extracting("id")
      .anySatisfy(id -> assertThat(id).isEqualTo(move1.getId()))
      .anySatisfy(id -> assertThat(id).isEqualTo(move2.getId()));

    assertThat(actual.getLink(SELF)).isPresent()
      .hasValueSatisfying(
        link -> assertThat(link.getHref()).isEqualTo(TIC_TAC_TOE_GAME_MOVE_PATH.replace("{gameId}", "game-id")));
    assertThat(actual.getLink(TIC_TAC_TOE_GAME_REL)).isPresent()
      .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(TIC_TAC_TOE_GAMES_PATH + "/game-id"));
  }
}
