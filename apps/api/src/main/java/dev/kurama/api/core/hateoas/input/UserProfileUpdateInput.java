package dev.kurama.api.core.hateoas.input;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserProfileUpdateInput {

  private String firstname;
  private String lastname;

}
