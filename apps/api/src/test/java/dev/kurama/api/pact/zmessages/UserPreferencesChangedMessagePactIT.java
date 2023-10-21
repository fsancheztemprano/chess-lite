package dev.kurama.api.pact.zmessages;

import au.com.dius.pact.provider.PactVerifyProvider;
import au.com.dius.pact.provider.junit.Provider;
import au.com.dius.pact.provider.junit.loader.PactFolder;
import au.com.dius.pact.provider.junit5.AmpqTestTarget;
import au.com.dius.pact.provider.junit5.PactVerificationContext;
import au.com.dius.pact.provider.junit5.PactVerificationInvocationContextProvider;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent;
import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent.UserPreferencesChangedEventAction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@IfProfileValue(name = "spring.profiles.active", values = {"pact"})
@ExtendWith(SpringExtension.class)
@Provider("ami")
@PactFolder("target/test-classes/pact-messages/userPreferencesChangedMessages")
public class UserPreferencesChangedMessagePactIT {

  @TestTemplate
  @ExtendWith(PactVerificationInvocationContextProvider.class)
  void pactVerificationTestTemplate(PactVerificationContext context) {
    context.verifyInteraction();
  }

  @BeforeEach
  void setUp(PactVerificationContext context) {
    context.setTarget(new AmpqTestTarget());
  }

  @PactVerifyProvider("a user preferences updated message")
  public String verifyUserPreferencesUpdatedMessage() throws JsonProcessingException {
    return new ObjectMapper().writeValueAsString(UserPreferencesChangedEvent.builder()
      .userPreferencesId("up1")
      .action(UserPreferencesChangedEventAction.UPDATED)
      .build());
  }

}
