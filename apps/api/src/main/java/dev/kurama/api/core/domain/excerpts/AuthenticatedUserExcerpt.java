package dev.kurama.api.core.domain.excerpts;

import dev.kurama.api.core.hateoas.model.UserModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpHeaders;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticatedUserExcerpt {

  private UserModel userModel;
  private HttpHeaders headers;
}
