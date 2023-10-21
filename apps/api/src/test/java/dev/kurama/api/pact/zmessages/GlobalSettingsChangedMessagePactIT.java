package dev.kurama.api.pact.zmessages;

import au.com.dius.pact.provider.PactVerifyProvider;
import au.com.dius.pact.provider.junit.Provider;
import au.com.dius.pact.provider.junit.loader.PactFolder;
import au.com.dius.pact.provider.junit5.AmpqTestTarget;
import au.com.dius.pact.provider.junit5.PactVerificationContext;
import au.com.dius.pact.provider.junit5.PactVerificationInvocationContextProvider;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent;
import dev.kurama.api.core.event.domain.GlobalSettingsChangedEvent.GlobalSettingsChangedEventAction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@IfProfileValue(name = "spring.profiles.active", values = {"pact"})
@ExtendWith(SpringExtension.class)
@Provider("ami")
@PactFolder("target/test-classes/pact-messages/globalSettingsChangedMessages")
public class GlobalSettingsChangedMessagePactIT {

  @TestTemplate
  @ExtendWith(PactVerificationInvocationContextProvider.class)
  void pactVerificationTestTemplate(PactVerificationContext context) {
    context.verifyInteraction();
  }

  @BeforeEach
  void setUp(PactVerificationContext context) {
    context.setTarget(new AmpqTestTarget());
  }

  @PactVerifyProvider("a global settings updated message")
  public String verifyGlobalSettingsUpdatedMessage() throws JsonProcessingException {
    return new ObjectMapper().writeValueAsString(
      GlobalSettingsChangedEvent.builder().action(GlobalSettingsChangedEventAction.UPDATED).build());
  }

}
