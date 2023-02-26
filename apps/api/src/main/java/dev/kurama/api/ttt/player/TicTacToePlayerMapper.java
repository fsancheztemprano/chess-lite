package dev.kurama.api.ttt.player;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface TicTacToePlayerMapper {

  @Mapping(target = "username", source = "user.username")
  TicTacToePlayerModel ticTacToePlayerToTicTacToePlayerModel(TicTacToePlayer ticTacToePlayer);

}
