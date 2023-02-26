package dev.kurama.api.ttt.game.input;

import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import org.springframework.hateoas.InputType;

@Builder
@Data
public class TicTacToeGameInput {

  @NonNull
  @NotNull
  private String oId;

  @NonNull
  @NotNull
  private String xId;

  @InputType("boolean")
  private Boolean isPrivate;

}
