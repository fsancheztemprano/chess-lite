package dev.kurama.chess.backend.poc.api.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookDTO extends RepresentationModel<BookDTO> {

  private Long id;
  private String isbn;
  private String title;
  private Long authorId;

}
