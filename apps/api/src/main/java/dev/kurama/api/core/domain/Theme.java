package dev.kurama.api.core.domain;

import jakarta.persistence.Cacheable;
import jakarta.persistence.Entity;
import java.io.Serializable;
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
public class Theme extends AbstractEntity implements Serializable {

  public static final String UNIQUE_ID = "unique";

  private String primaryColor;
  private String accentColor;
  private String warnColor;

}
