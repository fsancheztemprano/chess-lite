package dev.kurama.chess.backend.poc.domain;

import dev.kurama.chess.backend.core.domain.AbstractEntity;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@SuperBuilder
@Data
@NoArgsConstructor
@Entity
public class Author extends AbstractEntity implements Serializable {


  private String name;
  private String city;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
  private Set<Book> books = new HashSet<>();
}
