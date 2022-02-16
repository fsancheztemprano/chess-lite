package dev.kurama.api.core.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class DomainResponse {

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss", timezone = "Europe/Madrid")
  @Builder.Default
  private Date time = new Date();
  private HttpStatus status;
  private int code;
  private String title;
  private String message;


}
