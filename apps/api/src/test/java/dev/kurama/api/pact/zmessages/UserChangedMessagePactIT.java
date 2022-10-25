package dev.kurama.api.pact.zmessages;

import au.com.dius.pact.provider.PactVerifyProvider;
import au.com.dius.pact.provider.junit.Provider;
import au.com.dius.pact.provider.junit.loader.PactFolder;
import au.com.dius.pact.provider.junit5.AmpqTestTarget;
import au.com.dius.pact.provider.junit5.PactVerificationContext;
import au.com.dius.pact.provider.junit5.PactVerificationInvocationContextProvider;
import dev.kurama.api.core.event.domain.UserChangedEvent;
import dev.kurama.api.core.event.domain.UserChangedEvent.UserChangedEventAction;
import groovy.json.JsonOutput;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@IfProfileValue(name = "spring.profiles.active", values = {"pact"})
@ExtendWith(SpringExtension.class)
@Provider("ami")
@PactFolder("target/test-classes/pact-messages/userChangedMessages")
public class UserChangedMessagePactIT {

  @TestTemplate
  @ExtendWith(PactVerificationInvocationContextProvider.class)
  void pactVerificationTestTemplate(PactVerificationContext context) {
    context.verifyInteraction();
  }

  @BeforeEach
  void setUp(PactVerificationContext context) {
    context.setTarget(new AmpqTestTarget());
  }

  @PactVerifyProvider("a user created message")
  public String verifyUserCreatedMessage() {
    return JsonOutput.toJson(UserChangedEvent.builder().userId("u1").action(UserChangedEventAction.CREATED).build());
  }

  @PactVerifyProvider("a user updated message")
  public String verifyUserUpdatedMessage() {
    return JsonOutput.toJson(UserChangedEvent.builder().userId("u2").action(UserChangedEventAction.UPDATED).build());
  }

  @PactVerifyProvider("a user deleted message")
  public String verifyUserDeletedMessage() {
    return JsonOutput.toJson(UserChangedEvent.builder().userId("u3").action(UserChangedEventAction.DELETED).build());
  }

}
