package dev.kurama.api.core.domain;

import jakarta.persistence.Cacheable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.io.Serializable;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@SuperBuilder
@Getter
@Setter
@ToString
@NoArgsConstructor
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Entity
public class GlobalSettings extends AbstractEntity implements Serializable {

  public static final String UNIQUE_ID = "unique";

  @Builder.Default
  private boolean signupOpen = false;

  @OneToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(nullable = false)
  private Role defaultRole;

}
