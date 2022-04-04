package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.GlobalSettingsAuthority.GLOBAL_SETTINGS_READ;
import static dev.kurama.api.core.authority.GlobalSettingsAuthority.GLOBAL_SETTINGS_UPDATE;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.WEBSOCKET_REL;
import static dev.kurama.api.core.message.GlobalSettingsChangedMessageSender.GLOBAL_SETTINGS_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.core.utility.HateoasUtils.withDefaultAffordance;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.GlobalSettingsModel;
import dev.kurama.api.core.rest.GlobalSettingsController;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class GlobalSettingsModelProcessor implements RepresentationModelProcessor<GlobalSettingsModel> {


  @Override
  public @NonNull GlobalSettingsModel process(@NonNull GlobalSettingsModel globalSettingsModel) {
    return globalSettingsModel.add(getSelfLink())
      .mapLinkIf(hasAuthority(GLOBAL_SETTINGS_UPDATE), LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateAffordance()))
      .addIf(hasAuthority(GLOBAL_SETTINGS_READ), this::getWebSocket);
  }

  @SneakyThrows
  public @NonNull Link getSelfLink() {
    return withDefaultAffordance(linkTo(methodOn(GlobalSettingsController.class).get()).withSelfRel());
  }

  @SneakyThrows
  private @NonNull Affordance getUpdateAffordance() {
    return afford(methodOn(GlobalSettingsController.class).update(null));
  }

  private @NonNull Link getWebSocket() {
    return Link.of(GLOBAL_SETTINGS_CHANGED_CHANNEL).withRel(WEBSOCKET_REL);
  }
}
