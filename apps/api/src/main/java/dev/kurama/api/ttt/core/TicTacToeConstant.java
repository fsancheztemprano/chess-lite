package dev.kurama.api.ttt.core;

import static dev.kurama.api.core.constant.RestPathConstant.BASE_PATH;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TicTacToeConstant {

  public static final String TIC_TAC_TOE_BASE_PATH = BASE_PATH + "/tic-tac-toe";
  public static final String TIC_TAC_TOE_GAMES_PATH = TIC_TAC_TOE_BASE_PATH + "/game";
  public static final String TIC_TAC_TOE_GAME_PATH = TIC_TAC_TOE_GAMES_PATH + "/{gameId}";
  public static final String TIC_TAC_TOE_GAME_MOVE_PATH = TIC_TAC_TOE_GAME_PATH + "/move";
  public static final String TIC_TAC_TOE_PLAYER_PATH = TIC_TAC_TOE_BASE_PATH + "/player";
}
