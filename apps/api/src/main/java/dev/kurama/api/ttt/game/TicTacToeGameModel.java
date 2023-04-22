package dev.kurama.api.ttt.game;

import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
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
public class TicTacToeGameModel extends RepresentationModel<TicTacToeGameModel> {

  private String id;
  private Status status;
  private Boolean isPrivate;
  private Token turn;
  private String board;
  private TicTacToePlayerModel playerX;
  private TicTacToePlayerModel playerO;
  private Long requestedAt;
  private Long startedAt;
  private Long lastActivityAt;
  private Long finishedAt;
}
