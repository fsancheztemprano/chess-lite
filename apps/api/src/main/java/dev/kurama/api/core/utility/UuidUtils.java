package dev.kurama.api.core.utility;

import java.util.UUID;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UuidUtils {

  public static String randomUUID() {
    return UUID.randomUUID().toString();
  }
}
