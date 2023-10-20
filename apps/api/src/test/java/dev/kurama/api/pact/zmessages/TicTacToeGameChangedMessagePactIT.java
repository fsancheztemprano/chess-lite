package dev.kurama.api.pact.zmessages;

import au.com.dius.pact.provider.PactVerifyProvider;
import au.com.dius.pact.provider.junit.Provider;
import au.com.dius.pact.provider.junit.loader.PactFolder;
import au.com.dius.pact.provider.junit5.AmpqTestTarget;
import au.com.dius.pact.provider.junit5.PactVerificationContext;
import au.com.dius.pact.provider.junit5.PactVerificationInvocationContextProvider;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.TicTacToeGameChangedEvent;
import dev.kurama.api.ttt.game.TicTacToeGameChangedEvent.Action;
import dev.kurama.api.ttt.game.TicTacToeGameChangedEvent.TicTacToeGameChangedEventPlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@IfProfileValue(name = "spring.profiles.active", values = {"pact"})
@ExtendWith(SpringExtension.class)
@Provider("ami")
@PactFolder("target/test-classes/pact-messages/ticTacToeGameChangedMessages")
public class TicTacToeGameChangedMessagePactIT {

  @TestTemplate
  @ExtendWith(PactVerificationInvocationContextProvider.class)
  void pactVerificationTestTemplate(PactVerificationContext context) {
    context.verifyInteraction();
  }

  @BeforeEach
  void setUp(PactVerificationContext context) {
    context.setTarget(new AmpqTestTarget());
  }

  @PactVerifyProvider("a tic tac toe game created message")
  public String verifyTicTacToeGameCreatedMessage() throws JsonProcessingException {
    return new ObjectMapper().writeValueAsString(TicTacToeGameChangedEvent.builder()
      .action(Action.CREATED)
      .gameId("tic-tac-toe-g1")
      .playerO(TicTacToeGameChangedEventPlayer.builder().id("tic-tac-toe-p2").username("tic-tac-toe-p2").build())
      .playerX(TicTacToeGameChangedEventPlayer.builder().id("tic-tac-toe-p1").username("tic-tac-toe-p1").build())
      .status(Status.PENDING)
      .turn(TicTacToePlayer.Token.O)
      .build());
  }

  @PactVerifyProvider("a tic tac toe game updated message")
  public String verifyTicTacToeGameUpdatedMessage() throws JsonProcessingException {
    return new ObjectMapper().writeValueAsString(TicTacToeGameChangedEvent.builder()
      .action(Action.UPDATED)
      .gameId("tic-tac-toe-g1")
      .playerO(TicTacToeGameChangedEventPlayer.builder().id("tic-tac-toe-p2").username("tic-tac-toe-p2").build())
      .playerX(TicTacToeGameChangedEventPlayer.builder().id("tic-tac-toe-p1").username("tic-tac-toe-p1").build())
      .status(Status.IN_PROGRESS)
      .turn(Token.X)
      .build());
  }

}
