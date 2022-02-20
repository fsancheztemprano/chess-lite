package dev.kurama.api.core.service;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.domain.EmailTemplate;
import java.util.Properties;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class EmailServiceTest {

  @InjectMocks
  private EmailService emailService;

  @Mock
  private JavaMailSender emailSender;

  @Test
  void should_send_email() {
    EmailTemplate emailTemplate = EmailTemplate.builder()
      .text("email-text")
      .subject("email-subject")
      .to("email-to")
      .build();
    when(emailSender.createMimeMessage()).thenReturn(new MimeMessage(Session.getDefaultInstance(new Properties())));

    emailService.sendEmail(emailTemplate);

    verify(emailSender).send(any(MimeMessage.class));
  }
}
