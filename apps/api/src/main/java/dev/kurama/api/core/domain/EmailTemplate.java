package dev.kurama.api.core.domain;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class EmailTemplate {

  private String to;
  private String subject;
  private String text;
}
