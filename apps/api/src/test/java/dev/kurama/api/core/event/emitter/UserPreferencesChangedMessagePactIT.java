package dev.kurama.api.core.event.emitter;

import au.com.dius.pact.provider.PactVerifyProvider;
import au.com.dius.pact.provider.junit.Provider;
import au.com.dius.pact.provider.junit.loader.PactFolder;
import au.com.dius.pact.provider.junit5.AmpqTestTarget;
import au.com.dius.pact.provider.junit5.PactVerificationContext;
import au.com.dius.pact.provider.junit5.PactVerificationInvocationContextProvider;
import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent;
import dev.kurama.api.core.event.domain.UserPreferencesChangedEvent.UserPreferencesChangedEventAction;
import groovy.json.JsonOutput;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;

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
  public String verifyUserPreferencesUpdatedMessage() {
    return JsonOutput.toJson(UserPreferencesChangedEvent.builder()
      .userPreferencesId("up1")
      .action(UserPreferencesChangedEventAction.UPDATED)
      .build());
  }

}
