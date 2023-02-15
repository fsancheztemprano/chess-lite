package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.ThemeAuthority.THEME_UPDATE;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.core.utility.HateoasUtils.withDefaultAffordance;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.ThemeModel;
import dev.kurama.api.core.rest.ThemeController;
import lombok.NonNull;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class ThemeModelProcessor implements RepresentationModelProcessor<ThemeModel> {

  @Override
  public @NonNull ThemeModel process(@NonNull ThemeModel themeModel) {
    return themeModel.add(getSelfLink())
      .mapLinkIf(hasAuthority(THEME_UPDATE + ""), LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateAffordance()));
  }

  public @NonNull Link getSelfLink() {
    return withDefaultAffordance(linkTo(methodOn(ThemeController.class).get()).withSelfRel());
  }

  private @NonNull Affordance getUpdateAffordance() {
    return afford(methodOn(ThemeController.class).update(null));
  }
}
