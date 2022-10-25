package dev.kurama.api.core.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ActivationTokenConstant {


  public static final long ACTIVATION_TOKEN_EXPIRATION_TIME = 86_400_000; // 1 day in milliseconds
  public static final long ACTIVATION_TOKEN_DELAY = 180_000; // 3 minutes  in milliseconds
  public static final long ACTIVATION_TOKEN_MAX_ATTEMPTS = 4;

}
