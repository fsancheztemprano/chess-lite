package dev.kurama.api.ttt.game;

import dev.kurama.api.core.event.domain.ApplicationEvent;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TicTacToeGameChangedEvent implements ApplicationEvent {

  private Action action;
  private String gameId;
  private TicTacToeGameChangedEventPlayer playerO;
  private TicTacToeGameChangedEventPlayer playerX;
  private TicTacToeGame.Status status;
  private TicTacToePlayer.Token turn;

  public enum Action {
    CREATED, UPDATED
  }


  @Data
  @Builder
  public static class TicTacToeGameChangedEventPlayer {

    private String id;
    private String username;
  }
}
