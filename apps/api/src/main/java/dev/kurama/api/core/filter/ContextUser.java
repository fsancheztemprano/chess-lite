package dev.kurama.api.core.filter;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ContextUser {

  private String username;
  private String id;
}
