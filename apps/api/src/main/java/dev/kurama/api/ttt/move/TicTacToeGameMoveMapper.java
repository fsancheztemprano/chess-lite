package dev.kurama.api.ttt.move;

import dev.kurama.api.ttt.game.TicTacToeGameMapper;
import dev.kurama.api.ttt.player.TicTacToePlayerMapper;
import java.util.Collection;
import org.mapstruct.Mapper;

@Mapper(uses = {TicTacToeGameMapper.class, TicTacToePlayerMapper.class})
public interface TicTacToeGameMoveMapper {

  TicTacToeGameMoveModel ticTacToeGameMoveToTicTacToeGameMoveModel(TicTacToeGameMove ticTacToeGameMove);

  Collection<TicTacToeGameMoveModel> ticTacToeGameMoveCollectionToTicTacToeGameMoveCollectionModel(Collection<TicTacToeGameMove> ticTacToeGameMoves);


}
