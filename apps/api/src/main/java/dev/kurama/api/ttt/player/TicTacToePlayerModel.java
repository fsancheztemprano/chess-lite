package dev.kurama.api.ttt.player;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TicTacToePlayerModel extends RepresentationModel<TicTacToePlayerModel> {

  private String id;
  private String username;
  private int wins;
  private int losses;
  private int draws;

}
