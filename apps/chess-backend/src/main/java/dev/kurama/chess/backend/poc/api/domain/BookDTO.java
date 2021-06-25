package dev.kurama.chess.backend.poc.api.domain;

import dev.kurama.chess.backend.core.api.domain.AbstractDTO;
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
public class BookDTO extends AbstractDTO {

  private String isbn;
  private String title;
  private Long authorId;

}
