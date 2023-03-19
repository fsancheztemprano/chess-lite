package dev.kurama.api.ttt.move;

import dev.kurama.api.ttt.game.TicTacToeGameMapper;
import dev.kurama.api.ttt.player.TicTacToePlayerMapper;
import java.util.Collection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(uses = {TicTacToeGameMapper.class, TicTacToePlayerMapper.class})
public interface TicTacToeGameMoveMapper {

  @Mapping(target = "gameId", source = "game.id")
  TicTacToeGameMoveModel ticTacToeGameMoveToTicTacToeGameMoveModel(TicTacToeGameMove ticTacToeGameMove);

  Collection<TicTacToeGameMoveModel> ticTacToeGameMoveCollectionToTicTacToeGameMoveCollectionModel(Collection<TicTacToeGameMove> ticTacToeGameMoves);


}
