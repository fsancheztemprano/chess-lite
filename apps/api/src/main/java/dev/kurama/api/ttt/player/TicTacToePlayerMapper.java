package dev.kurama.api.ttt.player;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface TicTacToePlayerMapper {

  @Mapping(target = "username", source = "user.username")
  TicTacToePlayerModel ticTacToePlayerToTicTacToePlayerModel(TicTacToePlayer ticTacToePlayer);

  List<TicTacToePlayerModel> ticTacToePlayersToTicTacToePlayerModels(List<TicTacToePlayer> ticTacToePlayers);

}
