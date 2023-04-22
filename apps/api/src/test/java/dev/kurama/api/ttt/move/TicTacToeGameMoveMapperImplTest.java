package dev.kurama.api.ttt.move;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import dev.kurama.api.ttt.player.TicTacToePlayerMapper;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToeGameMoveMapperImplTest {

  @Autowired
  private TicTacToeGameMoveMapper mapper;

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

  TicTacToeGameMove move = TicTacToeGameMove.builder()
    .game(game)
    .board("OX__X__XO")
    .cell("B2")
    .token(Token.X)
    .number(1)
    .movedAt(LocalDateTime.now())
    .moveTime(1000L)
    .build();

  @Test
  void tic_tac_toe_game_move_to_tic_tac_toe_game_move_model() {
    TicTacToeGameMoveModel actual = mapper.ticTacToeGameMoveToTicTacToeGameMoveModel(move);
    assertNotNull(actual);
    assertEquals(move.getGame().getId(), actual.getGameId());
  }

  @Test
  void tic_tac_toe_game_move_to_tic_tac_toe_game_move_model_null() {
    TicTacToeGameMoveModel actual = mapper.ticTacToeGameMoveToTicTacToeGameMoveModel(null);
    assertNull(actual);
  }

  @Test
  void tic_tac_toe_game_move_collection_to_tic_tac_toe_game_move_collection_model() {
    Collection<TicTacToeGameMoveModel> actual = mapper.ticTacToeGameMoveCollectionToTicTacToeGameMoveCollectionModel(
      List.of(move));
    assertNotNull(actual);
    assertEquals(1, actual.size());
    assertEquals(move.getGame().getId(), actual.iterator().next().getGameId());
  }


  @TestConfiguration
  protected static class TicTacToeGameMoveMapperTestConfiguration {

    @Bean
    public TicTacToeGameMoveMapper TicTacToeGameMoveMapper() {
      return Mappers.getMapper(TicTacToeGameMoveMapper.class);
    }

    @Bean
    public TicTacToePlayerMapper TicTacToePlayerMapper() {
      return Mappers.getMapper(TicTacToePlayerMapper.class);
    }

  }
}
