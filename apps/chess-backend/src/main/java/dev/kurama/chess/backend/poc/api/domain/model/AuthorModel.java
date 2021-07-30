package dev.kurama.chess.backend.poc.api.domain.model;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class AuthorModel extends RepresentationModel<AuthorModel> {

  private String id;
  private String name;
  private String city;
  private List<String> bookIds;

}
