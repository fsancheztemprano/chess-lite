package dev.kurama.chess.backend.poc.api.domain;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;


@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthorDTO extends RepresentationModel<AuthorDTO> {

  private Long id;
  private String name;
  private String city;
  private List<Long> bookIds;

}
