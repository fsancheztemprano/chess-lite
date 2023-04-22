package dev.kurama.api.ttt.player;

import static org.assertj.core.util.Lists.newArrayList;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToePlayerMapperImplTest {

  @Autowired
  private TicTacToePlayerMapper mapper;

  TicTacToePlayer player = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();

  @Test
  void tic_tac_toe_player_to_tic_tac_toe_player_model() {
    TicTacToePlayerModel actual = mapper.ticTacToePlayerToTicTacToePlayerModel(player);
    
    assertEquals(player.getId(), actual.getId());
  }

  @Test
  void tic_tac_toe_player_page_to_tic_tac_toe_player_model_page() {
    ArrayList<TicTacToePlayer> ticTacToePlayers = newArrayList(player);

    List<TicTacToePlayerModel> ticTacToePlayerModels = mapper.ticTacToePlayersToTicTacToePlayerModels(ticTacToePlayers);

    assertEquals(ticTacToePlayers.size(), ticTacToePlayerModels.size());
    assertEquals(ticTacToePlayers.get(0).getId(), ticTacToePlayerModels.get(0).getId());
  }

  @TestConfiguration
  protected static class TicTacToePlayerMapperTestConfiguration {

    @Bean
    public TicTacToePlayerMapper TicTacToePlayerMapper() {
      return Mappers.getMapper(TicTacToePlayerMapper.class);
    }

  }
}
