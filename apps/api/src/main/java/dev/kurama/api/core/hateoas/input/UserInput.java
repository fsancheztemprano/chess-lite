package dev.kurama.api.core.hateoas.input;

import jakarta.validation.constraints.Email;
import java.util.Set;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Builder
@Data
public class UserInput {

  @Length(min = 5, max = 128)
  private String username;
  @Length(min = 6, max = 128)
  private String password;
  @Email
  private String email;
  private String firstname;
  private String lastname;
  private String profileImageUrl;
  private String roleId;
  private Set<String> authorityIds;
  @Builder.Default
  private Boolean active = true;
  @Builder.Default
  private Boolean locked = false;
  @Builder.Default
  private Boolean expired = false;
  @Builder.Default
  private Boolean credentialsExpired = false;
}
