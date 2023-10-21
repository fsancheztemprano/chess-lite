package dev.kurama.api.pact.zmessages;

import au.com.dius.pact.provider.PactVerifyProvider;
import au.com.dius.pact.provider.junit.Provider;
import au.com.dius.pact.provider.junit.loader.PactFolder;
import au.com.dius.pact.provider.junit5.AmpqTestTarget;
import au.com.dius.pact.provider.junit5.PactVerificationContext;
import au.com.dius.pact.provider.junit5.PactVerificationInvocationContextProvider;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kurama.api.core.event.domain.RoleChangedEvent;
import dev.kurama.api.core.event.domain.RoleChangedEvent.RoleChangedEventAction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.annotation.IfProfileValue;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@IfProfileValue(name = "spring.profiles.active", values = {"pact"})
@ExtendWith(SpringExtension.class)
@Provider("ami")
@PactFolder("target/test-classes/pact-messages/roleChangedMessages")
public class RoleChangedMessagePactIT {

  @TestTemplate
  @ExtendWith(PactVerificationInvocationContextProvider.class)
  void pactVerificationTestTemplate(PactVerificationContext context) {
    context.verifyInteraction();
  }

  @BeforeEach
  void setUp(PactVerificationContext context) {
    context.setTarget(new AmpqTestTarget());
  }

  @PactVerifyProvider("a role created message")
  public String verifyRoleCreatedMessage() throws JsonProcessingException {
    return new ObjectMapper().writeValueAsString(
      RoleChangedEvent.builder().roleId("r1").action(RoleChangedEventAction.CREATED).build());
  }

  @PactVerifyProvider("a role updated message")
  public String verifyRoleUpdatedMessage() throws JsonProcessingException {
    return new ObjectMapper().writeValueAsString(
      RoleChangedEvent.builder().roleId("r2").action(RoleChangedEventAction.UPDATED).build());
  }

  @PactVerifyProvider("a role deleted message")
  public String verifyRoleDeletedMessage() throws JsonProcessingException {
    return new ObjectMapper().writeValueAsString(
      RoleChangedEvent.builder().roleId("r3").action(RoleChangedEventAction.DELETED).build());
  }

}
