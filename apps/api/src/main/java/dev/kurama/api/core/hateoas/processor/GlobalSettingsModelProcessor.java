package dev.kurama.api.core.hateoas.processor;

import dev.kurama.api.core.hateoas.model.GlobalSettingsModel;
import dev.kurama.api.core.rest.GlobalSettingsController;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

import static dev.kurama.api.core.authority.GlobalSettingsAuthority.GLOBAL_SETTINGS_UPDATE;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class GlobalSettingsModelProcessor extends DomainModelProcessor<GlobalSettingsModel> {

  protected Class<GlobalSettingsController> getClazz() {
    return GlobalSettingsController.class;
  }

  @Override
  public @NonNull GlobalSettingsModel process(@NonNull GlobalSettingsModel globalSettingsModel) {
    return globalSettingsModel
      .add(getModelDefaultLink(null))
      .mapLinkIf(hasAuthority(GLOBAL_SETTINGS_UPDATE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateAffordance()))
      ;
  }

  @SneakyThrows
  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).get());
  }

  @SneakyThrows
  private @NonNull
  Affordance getUpdateAffordance() {
    return afford(methodOn(getClazz()).update(null));
  }
}
