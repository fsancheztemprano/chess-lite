package dev.kurama.support;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@TestConfiguration
public class TestEmailConfiguration {

  @Bean
  public JavaMailSenderImpl mailSender() {
    JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();

    javaMailSender.setProtocol("SMTP");
    javaMailSender.setHost("127.0.0.1");
    javaMailSender.setPort(25);

    return javaMailSender;
  }

}
