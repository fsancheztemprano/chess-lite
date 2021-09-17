package dev.kurama.api.core.constant;

import java.net.InetAddress;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ActivationTokenConstant {


  public static final long ACTIVATION_TOKEN_EXPIRATION_TIME = 86_400_000; // 1 day in milliseconds
  public static final long ACTIVATION_TOKEN_DELAY = 180_000; // 3 minutes  in milliseconds
  public static final long ACTIVATION_TOKEN_MAX_ATTEMPTS = 4;


  public static final String ACTIVATION_EMAIL_SUBJECT = "Your App Account Activation Token"; // 3 minutes  in milliseconds

  public static String getActivationEmailText(String token, String email) {
    String hostname = InetAddress.getLoopbackAddress().getHostName();
    if ("localhost".equals(hostname)) {
      hostname = "http://localhost:4200";
    }
    String activationEmailText =
      "Here is the token to activate your account:<br>"
        + "%s<br>"
        + "It is valid for 24 hours, you can follow this link to reset your password:<br>"
        + "<a href =\"" + hostname
        + "/auth/activation?token=%s&email=%s\"> Click Here </a><br>"
        + "Thank You";
    return String.format(activationEmailText, token, token, email);
  }

}
