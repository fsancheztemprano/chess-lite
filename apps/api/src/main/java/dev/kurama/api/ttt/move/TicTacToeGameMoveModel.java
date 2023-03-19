package dev.kurama.api.ttt.move;

import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayerModel;
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
public class TicTacToeGameMoveModel extends RepresentationModel<TicTacToeGameMoveModel> {

  private String cell;
  private TicTacToePlayer.Token token;
  private String board;
  private Integer number;
  private TicTacToePlayerModel player;
  private Long movedAt;
  private Long moveTime;
  private String gameId;

}
