package dev.kurama.api.auth.api.domain.input;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UpdateUserProfileInput {

  private String firstname;
  private String lastname;
  private String profileImageUrl;

}
