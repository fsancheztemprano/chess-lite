package dev.kurama.api.core.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RestPathConstant {

  public static final String BASE_PATH = "/api";
  public static final String GLOBAL_SETTINGS_PATH = BASE_PATH + "/global-settings";
  public static final String USER_PROFILE_PATH = BASE_PATH + "/user/profile";
  public static final String USER_PREFERENCES_PATH = BASE_PATH + "/user/preferences";
  public static final String AUTHENTICATION_PATH = BASE_PATH + "/auth";
  public static final String SERVICE_LOGS_PATH = BASE_PATH + "/administration/service-logs";
  public static final String AUTHORITY_PATH = BASE_PATH + "/authority";
  public static final String ROLE_PATH = BASE_PATH + "/role";
  public static final String USER_PATH = BASE_PATH + "/user";
}
