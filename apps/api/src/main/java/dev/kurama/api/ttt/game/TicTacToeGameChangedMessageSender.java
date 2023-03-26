package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.constant.WebsocketConstant.ROOT_WEBSOCKET_CHANNEL;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicTacToeGameChangedMessageSender {

  public static final String TIC_TAC_TOE_GAMES_CHANGED_CHANNEL = ROOT_WEBSOCKET_CHANNEL + "/tic-tac-toe/game";
  public static final String TIC_TAC_TOE_GAME_CHANGED_CHANNEL = TIC_TAC_TOE_GAMES_CHANGED_CHANNEL + "/%s";

  public static final String TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL = TIC_TAC_TOE_GAMES_CHANGED_CHANNEL + "/player/%s";

  @NonNull
  private final SimpMessagingTemplate template;

  public void sendTicTacToeGameChangedMessage(@NonNull TicTacToeGameChangedEvent event) {
    template.convertAndSend(TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAMES_CHANGED_CHANNEL, event);
    template.convertAndSend(
      String.format(TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_CHANGED_CHANNEL, event.getGameId()), event);
    template.convertAndSend(String.format(TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL,
      event.getPlayerX().getId()), event);
    template.convertAndSend(String.format(TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL,
      event.getPlayerO().getId()), event);
  }

}
