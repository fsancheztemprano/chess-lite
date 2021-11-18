package dev.kurama.api.core.service;

import dev.kurama.api.core.domain.EmailTemplate;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class EmailService {

  @NonNull
  private final JavaMailSender emailSender;

  public void sendEmail(EmailTemplate emailTemplate) {
    try {
      MimeMessage mimeMessage = emailSender.createMimeMessage();
      MimeMessageHelper message = new MimeMessageHelper(mimeMessage, "utf-8");
      message.setTo(emailTemplate.getTo());
      message.setSubject(emailTemplate.getSubject());
      message.setText(emailTemplate.getText(), true);
      emailSender.send(mimeMessage);
    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }
}
