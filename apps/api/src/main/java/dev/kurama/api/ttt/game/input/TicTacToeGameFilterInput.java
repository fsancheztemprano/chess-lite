package dev.kurama.api.ttt.game.input;

import java.util.List;
import lombok.Builder;
import lombok.Data;
import org.springframework.lang.Nullable;

@Data
@Builder
public class TicTacToeGameFilterInput {

  @Nullable
  private Boolean myGames;
  @Nullable
  private String player;
  @Nullable
  private List<String> status;
  @Nullable
  private Boolean isPrivate;
}
