package dev.kurama.api.core.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RestPathConstant {

  public static final String BASE_PATH = "/api";
  public static final String GLOBAL_SETTINGS_PATH = BASE_PATH + "/global-settings";
  public static final String USER_PROFILE_PATH = BASE_PATH + "/user/profile";
  public static final String AUTHENTICATION_PATH = BASE_PATH + "/auth";
}
