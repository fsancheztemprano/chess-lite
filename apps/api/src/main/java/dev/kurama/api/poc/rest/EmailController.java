package dev.kurama.api.poc.rest;

import static org.springframework.http.ResponseEntity.ok;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
public class EmailController {

  @Autowired
  private JavaMailSender emailSender;

  @GetMapping()
  public ResponseEntity<String> sendEmail() {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom("frango9000@gmail.com");
    message.setTo("frango9000@gmail.com");
    message.setSubject("subject");
    message.setText("text");
    emailSender.send(message);
    return ok().body("OK");
  }

}
