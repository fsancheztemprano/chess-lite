package dev.kurama.api.ttt.game;

import static dev.kurama.api.ttt.game.TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAMES_CHANGED_CHANNEL;
import static dev.kurama.api.ttt.game.TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_CHANGED_CHANNEL;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.TicTacToeGameChangedEvent.Action;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import dev.kurama.support.TestChannelInterceptor;
import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.AbstractSubscribableChannel;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles(value = "integration-test")
@SpringBootTest
class TicTacToeGameChangedEventEmitterIT {

  @Autowired
  private TicTacToeGameChangedEventEmitter emitter;

  @Autowired
  @Qualifier("brokerChannel")
  private AbstractSubscribableChannel channel;

  private TestChannelInterceptor testChannelInterceptor;

  @BeforeEach
  void setUp() {
    testChannelInterceptor = new TestChannelInterceptor();
    channel.addInterceptor(testChannelInterceptor);
  }

  TicTacToePlayer playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
  TicTacToePlayer playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();

  @Test
  void should_send_tic_tac_toe_game_created_message() throws InterruptedException, IOException {
    TicTacToeGame game = TicTacToeGame.builder()
      .setRandomUUID()
      .status(Status.PENDING)
      .playerX(playerX)
      .playerO(playerO)
      .turn(Token.O)
      .build();
    emitter.emitTicTacToeGameCreatedEvent(game);

    //games channel : /ami/tic-tac-toe/game
    Message<?> message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    StompHeaderAccessor messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(TIC_TAC_TOE_GAMES_CHANGED_CHANNEL);

    TicTacToeGameChangedEvent payload = new ObjectMapper().readValue((byte[]) message.getPayload(),
      TicTacToeGameChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("action", TicTacToeGameChangedEvent.Action.CREATED)
      .hasFieldOrPropertyWithValue("gameId", game.getId())
      .hasFieldOrPropertyWithValue("playerX.id", game.getPlayerX().getId())
      .hasFieldOrPropertyWithValue("playerX.username", game.getPlayerX().getUsername())
      .hasFieldOrPropertyWithValue("playerO.id", game.getPlayerO().getId())
      .hasFieldOrPropertyWithValue("playerO.username", game.getPlayerO().getUsername());

    assertThat(payload.getStatus()).isEqualTo(Status.PENDING);
    assertThat(payload.getTurn()).isEqualTo(Token.O);

    //game channel : /ami/tic-tac-toe/game/{gameId}
    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNotNull();

    messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(format(TIC_TAC_TOE_GAME_CHANGED_CHANNEL, game.getId()));

    payload = new ObjectMapper().readValue((byte[]) message.getPayload(), TicTacToeGameChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("action", TicTacToeGameChangedEvent.Action.CREATED)
      .hasFieldOrPropertyWithValue("gameId", game.getId())
      .hasFieldOrPropertyWithValue("playerX.id", game.getPlayerX().getId())
      .hasFieldOrPropertyWithValue("playerX.username", game.getPlayerX().getUsername())
      .hasFieldOrPropertyWithValue("playerO.id", game.getPlayerO().getId())
      .hasFieldOrPropertyWithValue("playerO.username", game.getPlayerO().getUsername());

    assertThat(payload.getStatus()).isEqualTo(Status.PENDING);
    assertThat(payload.getTurn()).isEqualTo(Token.O);

    //player x channel : /ami/tic-tac-toe/game/player/{playerId}
    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNotNull();

    messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(
      format(TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL, game.getPlayerX().getId()));

    payload = new ObjectMapper().readValue((byte[]) message.getPayload(), TicTacToeGameChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("action", TicTacToeGameChangedEvent.Action.CREATED)
      .hasFieldOrPropertyWithValue("gameId", game.getId())
      .hasFieldOrPropertyWithValue("playerX.id", game.getPlayerX().getId())
      .hasFieldOrPropertyWithValue("playerX.username", game.getPlayerX().getUsername())
      .hasFieldOrPropertyWithValue("playerO.id", game.getPlayerO().getId())
      .hasFieldOrPropertyWithValue("playerO.username", game.getPlayerO().getUsername());

    assertThat(payload.getStatus()).isEqualTo(Status.PENDING);
    assertThat(payload.getTurn()).isEqualTo(Token.O);

    //player o channel : /ami/tic-tac-toe/game/player/{playerId}
    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNotNull();

    messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(
      String.format(TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL,
        game.getPlayerO().getId()));

    payload = new ObjectMapper().readValue((byte[]) message.getPayload(), TicTacToeGameChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("action", TicTacToeGameChangedEvent.Action.CREATED)
      .hasFieldOrPropertyWithValue("gameId", game.getId())
      .hasFieldOrPropertyWithValue("playerX.id", game.getPlayerX().getId())
      .hasFieldOrPropertyWithValue("playerX.username", game.getPlayerX().getUsername())
      .hasFieldOrPropertyWithValue("playerO.id", game.getPlayerO().getId())
      .hasFieldOrPropertyWithValue("playerO.username", game.getPlayerO().getUsername());

    assertThat(payload.getStatus()).isEqualTo(Status.PENDING);
    assertThat(payload.getTurn()).isEqualTo(Token.O);

    //no more messages
    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNull();
  }

  @Test
  void should_send_tic_tac_toe_game_updated_message() throws InterruptedException, IOException {
    TicTacToeGame game = TicTacToeGame.builder()
      .setRandomUUID()
      .status(Status.IN_PROGRESS)
      .playerX(playerX)
      .playerO(playerO)
      .turn(Token.X)
      .build();
    emitter.emitTicTacToeGameUpdatedEvent(game);

    //games channel : /ami/tic-tac-toe/game
    Message<?> message = testChannelInterceptor.awaitMessage(2);
    assertThat(message).isNotNull();

    StompHeaderAccessor messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(TIC_TAC_TOE_GAMES_CHANGED_CHANNEL);

    TicTacToeGameChangedEvent payload = new ObjectMapper().readValue((byte[]) message.getPayload(),
      TicTacToeGameChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("action", Action.UPDATED)
      .hasFieldOrPropertyWithValue("gameId", game.getId())
      .hasFieldOrPropertyWithValue("playerX.id", game.getPlayerX().getId())
      .hasFieldOrPropertyWithValue("playerX.username", game.getPlayerX().getUsername())
      .hasFieldOrPropertyWithValue("playerO.id", game.getPlayerO().getId())
      .hasFieldOrPropertyWithValue("playerO.username", game.getPlayerO().getUsername());

    assertThat(payload.getStatus()).isEqualTo(Status.IN_PROGRESS);
    assertThat(payload.getTurn()).isEqualTo(Token.X);

    //game channel : /ami/tic-tac-toe/game/{gameId}
    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNotNull();

    messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(format(TIC_TAC_TOE_GAME_CHANGED_CHANNEL, game.getId()));

    payload = new ObjectMapper().readValue((byte[]) message.getPayload(), TicTacToeGameChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("action", Action.UPDATED)
      .hasFieldOrPropertyWithValue("gameId", game.getId())
      .hasFieldOrPropertyWithValue("playerX.id", game.getPlayerX().getId())
      .hasFieldOrPropertyWithValue("playerX.username", game.getPlayerX().getUsername())
      .hasFieldOrPropertyWithValue("playerO.id", game.getPlayerO().getId())
      .hasFieldOrPropertyWithValue("playerO.username", game.getPlayerO().getUsername());

    assertThat(payload.getStatus()).isEqualTo(Status.IN_PROGRESS);
    assertThat(payload.getTurn()).isEqualTo(Token.X);

    //player x channel : /ami/tic-tac-toe/game/player/{playerId}
    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNotNull();

    messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(
      format(TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL, game.getPlayerX().getId()));

    payload = new ObjectMapper().readValue((byte[]) message.getPayload(), TicTacToeGameChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("action", Action.UPDATED)
      .hasFieldOrPropertyWithValue("gameId", game.getId())
      .hasFieldOrPropertyWithValue("playerX.id", game.getPlayerX().getId())
      .hasFieldOrPropertyWithValue("playerX.username", game.getPlayerX().getUsername())
      .hasFieldOrPropertyWithValue("playerO.id", game.getPlayerO().getId())
      .hasFieldOrPropertyWithValue("playerO.username", game.getPlayerO().getUsername());

    assertThat(payload.getStatus()).isEqualTo(Status.IN_PROGRESS);
    assertThat(payload.getTurn()).isEqualTo(Token.X);

    //player o channel : /ami/tic-tac-toe/game/player/{playerId}
    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNotNull();

    messageHeaders = StompHeaderAccessor.wrap(message);
    assertThat(messageHeaders.getContentType()).isEqualTo(APPLICATION_JSON);
    assertThat(messageHeaders.getDestination()).isEqualTo(
      String.format(TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_PLAYER_CHANGED_CHANNEL,
        game.getPlayerO().getId()));

    payload = new ObjectMapper().readValue((byte[]) message.getPayload(), TicTacToeGameChangedEvent.class);
    assertThat(payload).isNotNull()
      .hasFieldOrPropertyWithValue("action", Action.UPDATED)
      .hasFieldOrPropertyWithValue("gameId", game.getId())
      .hasFieldOrPropertyWithValue("playerX.id", game.getPlayerX().getId())
      .hasFieldOrPropertyWithValue("playerX.username", game.getPlayerX().getUsername())
      .hasFieldOrPropertyWithValue("playerO.id", game.getPlayerO().getId())
      .hasFieldOrPropertyWithValue("playerO.username", game.getPlayerO().getUsername());

    assertThat(payload.getStatus()).isEqualTo(Status.IN_PROGRESS);
    assertThat(payload.getTurn()).isEqualTo(Token.X);

    //no more messages
    message = testChannelInterceptor.awaitMessage(1);
    assertThat(message).isNull();
  }
}
