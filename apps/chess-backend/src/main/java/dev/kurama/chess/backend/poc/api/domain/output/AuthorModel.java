package dev.kurama.chess.backend.poc.api.domain.output;

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
public class AuthorModel extends RepresentationModel<AuthorModel> {

  private Long id;
  private String name;
  private String city;
  private List<Long> bookIds;

}
