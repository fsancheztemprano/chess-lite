package dev.kurama.api.ttt.game;

import static com.google.common.collect.Lists.newArrayList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.tuple;

import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.player.TicTacToePlayerMapper;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToeGameMapperTest {

  @Autowired
  private TicTacToeGameMapper mapper;

  TicTacToeGame game = TicTacToeGame.builder()
    .setRandomUUID()
    .status(Status.PENDING)
    .lastActivityAt(LocalDateTime.now())
    .requestedAt(LocalDateTime.now())
    .build();

  @Test
  void tic_tac_toe_game_to_tic_tac_toe_game_model() {
    TicTacToeGameModel actual = mapper.ticTacToeGameToTicTacToeGameModel(game);
    assertThat(actual).hasFieldOrPropertyWithValue("id", game.getId())
      .hasFieldOrPropertyWithValue("status", game.getStatus())
      .hasFieldOrPropertyWithValue("requestedAt", game.getRequestedAt().toInstant(ZoneOffset.UTC).toEpochMilli())
      .hasFieldOrPropertyWithValue("lastActivityAt", game.getLastActivityAt().toInstant(ZoneOffset.UTC).toEpochMilli());
  }

  @Test
  void tic_tac_toe_game_page_to_tic_tac_toe_game_model_page() {
    PageImpl<TicTacToeGame> page = new PageImpl<TicTacToeGame>(newArrayList(game));
    Page<TicTacToeGameModel> actual = mapper.ticTacToeGamePageToTicTacToeGameModelPage(page);
    assertThat(actual).hasSize(1)
      .extracting("id", "status", "requestedAt", "lastActivityAt")
      .contains(tuple(game.getId(), game.getStatus(), game.getRequestedAt().toInstant(ZoneOffset.UTC).toEpochMilli(),
        game.getLastActivityAt().toInstant(ZoneOffset.UTC).toEpochMilli()));
  }


  @TestConfiguration
  protected static class TicTacToeGameMapperTestConfiguration {

    @Bean
    public TicTacToeGameMapper TicTacToeGameMapper() {
      return Mappers.getMapper(TicTacToeGameMapper.class);
    }

    @Bean
    public TicTacToePlayerMapper TicTacToePlayerMapper() {
      return Mappers.getMapper(TicTacToePlayerMapper.class);
    }

  }
}
