package dev.kurama.api.core.domain;

import java.io.Serializable;
import javax.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@ToString
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
public class Authority extends AbstractEntity implements Serializable {

  @NonNull
  private String name;

}
