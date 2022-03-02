package dev.kurama.api.core.hateoas.input;

import java.util.Set;
import javax.validation.constraints.Email;
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
  private String firstname;
  private String lastname;
  @Email
  private String email;
  private String profileImageUrl;
  private String roleId;
  private Set<String> authorityIds;
  @Builder.Default
  private Boolean active = true;
  @Builder.Default
  private Boolean locked = true;
  @Builder.Default
  private Boolean expired = true;
  @Builder.Default
  private Boolean credentialsExpired = true;
}
