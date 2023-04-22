package dev.kurama.api.ttt.move;

import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Builder
@Data
public class TicTacToeGameMoveInput {

  @NonNull
  @NotNull
  private String cell;

}
