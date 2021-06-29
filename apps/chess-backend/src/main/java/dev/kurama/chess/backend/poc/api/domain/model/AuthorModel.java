package dev.kurama.chess.backend.poc.api.domain.model;

import dev.kurama.chess.backend.core.api.domain.DomainModel;
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
public class AuthorModel extends RepresentationModel<AuthorModel> implements DomainModel {

  private Long id;
  private String name;
  private String city;
  private List<Long> bookIds;

}
