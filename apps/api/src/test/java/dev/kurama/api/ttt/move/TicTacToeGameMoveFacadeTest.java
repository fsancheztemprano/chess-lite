package dev.kurama.api.ttt.move;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.hateoas.CollectionModel;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToeGameMoveFacadeTest {

  @InjectMocks
  private TicTacToeGameMoveFacade facade;

  @Mock
  private TicTacToeGameMoveFacility facility;

  @Mock
  private TicTacToeGameMoveMapper mapper;

  @Mock
  private TicTacToeGameMoveModelAssembler assembler;

  TicTacToeGame game = TicTacToeGame.builder()
    .setRandomUUID()
    .status(Status.IN_PROGRESS)
    .isPrivate(false)
    .requestedAt(LocalDateTime.ofEpochSecond(1000000 / 1000, 0, ZoneOffset.UTC))
    .lastActivityAt(LocalDateTime.ofEpochSecond(2000000 / 1000, 0, ZoneOffset.UTC))
    .startedAt(LocalDateTime.ofEpochSecond(2000000 / 1000, 0, ZoneOffset.UTC))
    .build();
  TicTacToeGameMove move = TicTacToeGameMove.builder()
    .id(game.getId())
    .game(game)
    .board("XO_XO_X__")
    .cell("B2")
    .token(Token.X)
    .number(5)
    .movedAt(LocalDateTime.now())
    .moveTime(1000L)
    .build();
  TicTacToeGameMoveModel gameMoveModel = TicTacToeGameMoveModel.builder().id(randomUUID()).gameId(randomUUID()).build();

  @Test
  void should_move() {
    TicTacToeGameMoveInput input = TicTacToeGameMoveInput.builder().cell("B2").build();
    when(facility.move(gameMoveModel.getGameId(), input)).thenReturn(move);
    when(mapper.ticTacToeGameMoveToTicTacToeGameMoveModel(move)).thenReturn(gameMoveModel);

    assertEquals(facade.move(gameMoveModel.getGameId(), input), gameMoveModel);
  }

  @Test
  void should_get_all_game_moves() {
    List<TicTacToeGameMove> moves = List.of(move);
    List<TicTacToeGameMoveModel> models = List.of(gameMoveModel);
    CollectionModel<TicTacToeGameMoveModel> movesModel = CollectionModel.of(models);
    when(facility.getAllGameMoves(gameMoveModel.getGameId())).thenReturn(moves);
    when(mapper.ticTacToeGameMoveCollectionToTicTacToeGameMoveCollectionModel(moves)).thenReturn(models);
    when(assembler.toCollectionModel(models, gameMoveModel.getGameId())).thenReturn(movesModel);

    assertEquals(facade.getAllGameMoves(gameMoveModel.getGameId()), movesModel);
  }


}
