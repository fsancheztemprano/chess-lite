package dev.kurama.api.core.service;

import static dev.kurama.api.core.constant.ActivationTokenConstant.ACTIVATION_EMAIL_SUBJECT;
import static dev.kurama.api.core.constant.ActivationTokenConstant.ACTIVATION_TOKEN_DELAY;
import static dev.kurama.api.core.constant.ActivationTokenConstant.ACTIVATION_TOKEN_EXPIRATION_TIME;
import static dev.kurama.api.core.constant.ActivationTokenConstant.ACTIVATION_TOKEN_MAX_ATTEMPTS;
import static dev.kurama.api.core.constant.ActivationTokenConstant.getActivationEmailText;

import dev.kurama.api.core.domain.ActivationToken;
import dev.kurama.api.core.domain.EmailTemplate;
import dev.kurama.api.core.exception.domain.ActivationTokenEmailMismatchException;
import dev.kurama.api.core.exception.domain.ActivationTokenExpiredException;
import dev.kurama.api.core.exception.domain.ActivationTokenNotFoundException;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.EmailNotFoundException;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.repository.ActivationTokenRepository;
import dev.kurama.api.core.repository.UserRepository;
import java.util.Date;
import java.util.UUID;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailSendException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivationTokenService {

  @NonNull
  private final ActivationTokenRepository activationTokenRepository;

  @NonNull
  private final UserRepository userRepository;

  @NonNull
  private final EmailService emailService;

  @NonNull
  private final BCryptPasswordEncoder passwordEncoder;

  public void sendActivationToken(String email) throws EmailNotFoundException, ActivationTokenRecentException {
    var user = userRepository.findUserByEmail(email).orElseThrow(() -> new EmailNotFoundException(email));

    var activationToken = activationTokenRepository.findActivationTokenByUser(user);
    if (activationToken.isPresent()) {
      if (activationToken.get().getCreated().getTime() > System.currentTimeMillis() - ACTIVATION_TOKEN_DELAY) {
        throw new ActivationTokenRecentException();
      } else {
        activationTokenRepository.delete(activationToken.get());
      }
    }

    user.setLocked(true);
    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
    userRepository.saveAndFlush(user);

    ActivationToken newToken = activationTokenRepository.saveAndFlush(ActivationToken.builder()
      .setRandomUUID()
      .attempts(0)
      .created(new Date())
      .user(user)
      .build());

    try {
      emailService.sendEmail(
        EmailTemplate.builder()
          .to(user.getEmail())
          .subject(ACTIVATION_EMAIL_SUBJECT)
          .text(getActivationEmailText(newToken.getId(), user.getEmail()))
          .build());
    } catch (MailSendException e) {
      activationTokenRepository.delete(newToken);
      throw e;
    }
  }

  public void activateAccount(AccountActivationInput accountActivationInput)
    throws ActivationTokenNotFoundException, EmailNotFoundException, ActivationTokenEmailMismatchException, ActivationTokenExpiredException {
    var token = activationTokenRepository.findActivationTokenById(accountActivationInput.getToken())
      .orElseThrow(() -> new ActivationTokenNotFoundException(accountActivationInput.getToken()));

    if (token.getCreated().getTime() + ACTIVATION_TOKEN_EXPIRATION_TIME < System.currentTimeMillis()) {
      activationTokenRepository.delete(token);
      throw new ActivationTokenExpiredException(accountActivationInput.getToken());
    }

    var user = userRepository.findUserByEmail(accountActivationInput.getEmail())
      .orElseThrow(() -> new EmailNotFoundException(accountActivationInput.getEmail()));

    if (!accountActivationInput.getEmail().equalsIgnoreCase(token.getUser().getEmail())) {
      token.setAttempts(token.getAttempts() + 1);
      if (token.getAttempts() > ACTIVATION_TOKEN_MAX_ATTEMPTS) {
        activationTokenRepository.delete(token);
      }
      throw new ActivationTokenEmailMismatchException(accountActivationInput.getEmail());
    }

    activationTokenRepository.delete(token);

    user.setLocked(false);
    user.setPassword(passwordEncoder.encode(accountActivationInput.getPassword()));
    userRepository.saveAndFlush(user);

    emailService.sendEmail(
      EmailTemplate.builder()
        .to(user.getEmail())
        .subject(ACTIVATION_EMAIL_SUBJECT)
        .text("Your Account has just been Activated.")
        .build());
  }
}
