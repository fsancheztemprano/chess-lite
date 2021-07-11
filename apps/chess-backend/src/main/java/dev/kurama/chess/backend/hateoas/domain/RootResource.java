package dev.kurama.chess.backend.hateoas.domain;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@NoArgsConstructor
public class RootResource extends RepresentationModel<RootResource> {

}
