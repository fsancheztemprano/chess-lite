package dev.kurama.api.core.utility;

import static org.springframework.hateoas.mediatype.Affordances.of;

import dev.kurama.api.core.hateoas.relations.HateoasRelations;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpMethod;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class HateoasUtils {

  public static @NonNull
  Link withDefaultAffordance(Link link) {
    return of(link)
      .afford(HttpMethod.HEAD)
      .withName(HateoasRelations.DEFAULT)
      .toLink();
  }
}
