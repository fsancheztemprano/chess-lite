package dev.kurama.api.core.domain;

import java.io.Serializable;
import javax.persistence.Cacheable;
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
