package dev.kurama.chess.backend.domain;

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
public class HttpResponse {

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM-dd-yyyy hh:mm:ss", timezone = "America/New_York")
  private Date timeStamp;
  private int httpStatusCode;
  private HttpStatus httpStatus;
  private String reason;
  private String message;
}
