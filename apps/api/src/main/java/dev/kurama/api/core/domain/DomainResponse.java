package dev.kurama.api.core.domain;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class DomainResponse {

  @Builder.Default
  private Date time = new Date();
  private int status;
  private String reason;
  private String title;
  private String message;


}
