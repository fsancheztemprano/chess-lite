package dev.kurama.api.ttt.game;

import static org.junit.jupiter.api.Assertions.assertEquals;

import dev.kurama.api.ttt.player.TicTacToePlayer;
import org.junit.jupiter.api.Test;

class TicTacToeGameTest {

  private final TicTacToeGame game = new TicTacToeGame();

  @Test
  void should_get_current_player_x() {
    game.setTurn(TicTacToePlayer.Token.X);
    assertEquals(game.getCurrentPlayer(), game.getPlayerX());
  }

  @Test
  void should_get_current_player_o() {
    game.setTurn(TicTacToePlayer.Token.O);
    assertEquals(game.getCurrentPlayer(), game.getPlayerO());
  }

}
