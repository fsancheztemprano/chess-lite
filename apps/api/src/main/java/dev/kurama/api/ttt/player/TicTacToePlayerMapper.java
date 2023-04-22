package dev.kurama.api.ttt.player;

import java.util.List;
import org.mapstruct.Mapper;

@Mapper
public interface TicTacToePlayerMapper {

  TicTacToePlayerModel ticTacToePlayerToTicTacToePlayerModel(TicTacToePlayer ticTacToePlayer);

  List<TicTacToePlayerModel> ticTacToePlayersToTicTacToePlayerModels(List<TicTacToePlayer> ticTacToePlayers);

}
