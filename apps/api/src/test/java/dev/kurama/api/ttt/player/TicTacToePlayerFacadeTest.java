package dev.kurama.api.ttt.player;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.hateoas.CollectionModel;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToePlayerFacadeTest {

  @InjectMocks
  private TicTacToePlayerFacade facade;

  @Mock
  private TicTacToePlayerService service;

  @Mock
  private TicTacToePlayerMapper mapper;

  @Mock
  private TicTacToePlayerModelAssembler assembler;

  @Test
  void should_find_players() {
    TicTacToePlayer player1 = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
    TicTacToePlayer player2 = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();

    List<TicTacToePlayer> players = List.of(player1, player2);

    TicTacToePlayerModel model1 = TicTacToePlayerModel.builder()
      .id(player1.getId())
      .username(player1.getUsername())
      .build();
    TicTacToePlayerModel model2 = TicTacToePlayerModel.builder()
      .id(player2.getId())
      .username(player2.getUsername())
      .build();

    List<TicTacToePlayerModel> models = List.of(model1, model2);
    CollectionModel<TicTacToePlayerModel> expected = CollectionModel.of(models);

    when(service.findPlayers("user")).thenReturn(players);
    when(mapper.ticTacToePlayersToTicTacToePlayerModels(players)).thenReturn(models);
    when(assembler.toCollectionModel(models)).thenReturn(expected);

    CollectionModel<TicTacToePlayerModel> actual = facade.findPlayers("user");

    assertEquals(expected, actual);
  }
}
