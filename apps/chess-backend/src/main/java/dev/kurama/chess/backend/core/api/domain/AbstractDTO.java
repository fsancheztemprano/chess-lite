package dev.kurama.chess.backend.core.api.domain;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@NoArgsConstructor
public class AbstractDTO {

  private Long id;
}
