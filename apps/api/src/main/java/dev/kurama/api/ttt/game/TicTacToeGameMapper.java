package dev.kurama.api.ttt.game;

import dev.kurama.api.ttt.player.TicTacToePlayerMapper;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

@Mapper(uses = {TicTacToePlayerMapper.class})
public interface TicTacToeGameMapper {

  @Mapping(target = "isPrivate", source = "private")
  TicTacToeGameModel ticTacToeGameToTicTacToeGameModel(TicTacToeGame ticTacToeGame);

  default Long map(LocalDateTime value) {
    return value == null ? null : value.toEpochSecond(ZoneOffset.UTC);
  }

  default Page<TicTacToeGameModel> ticTacToeGamePageToTicTacToeGameModelPage(Page<TicTacToeGame> roles) {
    return roles.map(this::ticTacToeGameToTicTacToeGameModel);
  }

}
