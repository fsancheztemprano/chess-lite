package dev.kurama.api.core.service;

import dev.kurama.api.core.domain.EmailTemplate;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.mail.internet.MimeMessage;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Flogger
public class EmailService {

  @NonNull
  private final JavaMailSender emailSender;

  public void sendEmail(EmailTemplate emailTemplate) {
    try {
      ExecutorService emailExecutor = Executors.newSingleThreadExecutor();
      emailExecutor.execute(() -> {
        try {
          MimeMessage mimeMessage = emailSender.createMimeMessage();
          MimeMessageHelper message = new MimeMessageHelper(mimeMessage, "utf-8");
          message.setTo(emailTemplate.getTo());
          message.setSubject(emailTemplate.getSubject());
          message.setText(emailTemplate.getText(), true);
          emailSender.send(mimeMessage);

        } catch (Exception exception) {
          log.atFiner().withCause(exception).log("Email sending failed");
        }
      });
      emailExecutor.shutdown();
    } catch (Exception exception) {
      log.atFiner().withCause(exception).log("Email sending failed");
    }
  }
}
