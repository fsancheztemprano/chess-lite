package dev.kurama.api.core.service;

import dev.kurama.api.core.domain.EmailTemplate;
import jakarta.mail.internet.MimeMessage;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Flogger
public class EmailService {

  @NonNull
  private final JavaMailSender emailSender;

  @Async
  public void sendEmail(EmailTemplate emailTemplate) {
    try {
      MimeMessage mimeMessage = emailSender.createMimeMessage();
      MimeMessageHelper message = new MimeMessageHelper(mimeMessage, "utf-8");
      message.setTo(emailTemplate.getTo());
      message.setSubject(emailTemplate.getSubject());
      message.setText(emailTemplate.getText(), true);
      emailSender.send(mimeMessage);
    } catch (Exception exception) {
      log.atInfo().withCause(exception).log("Email sending failed");
    }
  }
}
