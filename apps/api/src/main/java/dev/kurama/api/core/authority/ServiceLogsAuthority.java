package dev.kurama.api.core.authority;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component("ServiceLogsAuthority")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ServiceLogsAuthority {

  public static final String SERVICE_LOGS_READ = "service-logs:read";
  public static final String SERVICE_LOGS_DELETE = "service-logs:delete";

}
