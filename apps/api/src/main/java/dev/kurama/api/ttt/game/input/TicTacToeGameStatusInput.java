package dev.kurama.api.ttt.game.input;

import dev.kurama.api.ttt.game.TicTacToeGameService;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Builder
@Data
public class TicTacToeGameStatusInput {

  @NonNull
  @NotNull
  @Pattern(regexp = TicTacToeGameService.CHANGE_STATUS_REGEX)
  private String status;

}
