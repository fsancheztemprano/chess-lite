package dev.kurama.api.core.hateoas.input;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UpdateUserProfileInput {

  private String firstname;
  private String lastname;
  private String profileImageUrl;

}
