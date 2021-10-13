package dev.kurama.api.core.domain;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
public class GlobalSettings extends AbstractEntity implements Serializable {

  @Builder.Default
  private boolean signupOpen = false;

  @OneToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(nullable = false)
  private Role defaultRole;

}
