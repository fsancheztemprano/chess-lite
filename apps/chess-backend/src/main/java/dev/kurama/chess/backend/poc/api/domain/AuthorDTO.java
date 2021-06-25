package dev.kurama.chess.backend.poc.api.domain;

import dev.kurama.chess.backend.core.api.domain.AbstractDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
public class AuthorDTO extends AbstractDTO {

  private String name;
  private String city;
  private List<Long> bookIds;

}
