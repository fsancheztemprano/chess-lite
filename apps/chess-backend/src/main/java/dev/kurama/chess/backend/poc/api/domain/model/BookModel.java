package dev.kurama.chess.backend.poc.api.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BookModel extends RepresentationModel<BookModel> {

  private String id;
  private String isbn;
  private String title;
  private String authorId;

}
