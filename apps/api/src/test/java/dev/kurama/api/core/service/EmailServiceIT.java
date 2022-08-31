package dev.kurama.api.core.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.icegreen.greenmail.configuration.GreenMailConfiguration;
import com.icegreen.greenmail.junit5.GreenMailExtension;
import com.icegreen.greenmail.util.GreenMailUtil;
import com.icegreen.greenmail.util.ServerSetupTest;
import dev.kurama.api.core.domain.EmailTemplate;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles({"integration-test", "integration-email"})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@EnableAsync
class EmailServiceIT {

  @Autowired
  private EmailService service;

  @RegisterExtension
  static GreenMailExtension greenMail = new GreenMailExtension(ServerSetupTest.SMTP).withConfiguration(
    GreenMailConfiguration.aConfig().withUser("springboot", "springboot")).withPerMethodLifecycle(false);

  @Test
  void should_send_email() throws MessagingException {
    EmailTemplate emailTemplate = EmailTemplate.builder()
      .text("Test Body")
      .to("sender@here.com")
      .subject("Test")
      .build();
    service.sendEmail(emailTemplate);

    greenMail.waitForIncomingEmail(10000, 1);

    MimeMessage[] receivedMessages = greenMail.getReceivedMessages();
    assertEquals(1, receivedMessages.length);

    MimeMessage receivedMessage = receivedMessages[0];
    assertEquals(emailTemplate.getText(), GreenMailUtil.getBody(receivedMessage));
    assertEquals(1, receivedMessage.getAllRecipients().length);
    assertEquals(emailTemplate.getTo(), receivedMessage.getAllRecipients()[0].toString());
  }
}
