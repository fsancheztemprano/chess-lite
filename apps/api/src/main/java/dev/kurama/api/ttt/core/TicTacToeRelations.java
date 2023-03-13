package dev.kurama.api.ttt.core;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.WEBSOCKET_REL;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TicTacToeRelations {


  public static final String TIC_TAC_TOE_REL = "tic-tac-toe";
  public static final String TIC_TAC_TOE_CREATE_REL = "create";
  public static final String TIC_TAC_TOE_STATUS_REL = "status";
  public static final String TIC_TAC_TOE_GAME_REL = "game";
  public static final String TIC_TAC_TOE_GAMES_REL = "games";
  public static final String TIC_TAC_TOE_MOVE_REL = "move";
  public static final String TIC_TAC_TOE_MOVES_REL = "moves";
  public static final String TIC_TAC_TOE_PLAYER_REL = "player";
  public static final String TIC_TAC_TOE_PLAYERS_REL = "players";

  public static final String TIC_TAC_TOE_WS_GAMES = WEBSOCKET_REL + ":" + TIC_TAC_TOE_GAMES_REL;
  public static final String TIC_TAC_TOE_WS_GAME = WEBSOCKET_REL + ":" + TIC_TAC_TOE_GAME_REL;
  public static final String TIC_TAC_TOE_WS_GAME_PLAYER = TIC_TAC_TOE_WS_GAME + ":" + TIC_TAC_TOE_PLAYER_REL;
}
