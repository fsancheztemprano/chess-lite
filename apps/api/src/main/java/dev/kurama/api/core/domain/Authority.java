package dev.kurama.api.core.domain;

import jakarta.persistence.Cacheable;
import jakarta.persistence.Entity;
import java.io.Serializable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
@Entity
public class Authority extends AbstractEntity implements Serializable {

  @NonNull
  private String name;

}
