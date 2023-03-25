package dev.kurama.api.ttt.move;

import dev.kurama.api.ttt.player.TicTacToePlayerMapper;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(uses = {TicTacToePlayerMapper.class})
public interface TicTacToeGameMoveMapper {

  @Mapping(target = "gameId", source = "game.id")
  TicTacToeGameMoveModel ticTacToeGameMoveToTicTacToeGameMoveModel(TicTacToeGameMove ticTacToeGameMove);

  Collection<TicTacToeGameMoveModel> ticTacToeGameMoveCollectionToTicTacToeGameMoveCollectionModel(Collection<TicTacToeGameMove> ticTacToeGameMoves);

  default Long map(LocalDateTime value) {
    return value == null ? null : value.toInstant(ZoneOffset.UTC).toEpochMilli();
  }

}
