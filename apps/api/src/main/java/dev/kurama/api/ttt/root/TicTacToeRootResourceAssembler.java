package dev.kurama.api.ttt.root;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.ROOT_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.core.utility.HateoasUtils.withDefaultAffordance;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_GAMES_REL;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_GAME_REL;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_PLAYERS_REL;
import static org.springframework.hateoas.mediatype.Affordances.of;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.web.util.UriComponentsBuilder.fromUri;

import dev.kurama.api.core.hateoas.payload.InputPayloadMetadataImpl;
import dev.kurama.api.core.hateoas.payload.PropertyMetadataImpl;
import dev.kurama.api.core.hateoas.root.model.RootResource;
import dev.kurama.api.core.hateoas.root.processor.RootAssembler;
import dev.kurama.api.core.hateoas.root.rest.RootController;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import dev.kurama.api.ttt.core.TicTacToeRelations;
import dev.kurama.api.ttt.game.TicTacToeGameController;
import dev.kurama.api.ttt.player.TicTacToePlayerController;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.TemplateVariables;
import org.springframework.hateoas.UriTemplate;
import org.springframework.hateoas.mediatype.hal.HalModelBuilder;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class TicTacToeRootResourceAssembler implements RootAssembler<RootResource> {

  @NonNull
  private final HateoasPageableHandlerMethodArgumentResolver pageableResolver;

  public @NonNull RepresentationModel<RootResource> assemble() {
    HalModelBuilder rootModel = HalModelBuilder.halModelOf(new RootResource())
      .link(getSelfLink())
      .link(getParentLink())
      .link(getAllGamesLink())
      .link(getOneGameLink())
      .link(getFindPlayersLink())
      .link(getCreateAffordance());

    return rootModel.build();
  }

  private @NonNull Link getSelfLink() {
    return withDefaultAffordance(linkTo(methodOn(TicTacToeRootController.class).root()).withSelfRel());
  }

  private @NonNull Link getParentLink() {
    return linkTo(methodOn(RootController.class).root()).withRel(ROOT_REL);
  }

  private @NonNull Link getAllGamesLink() {
    return getExpandedLink(linkTo(methodOn(TicTacToeGameController.class).getAll(null, null, null, null, null)).withRel(
      TIC_TAC_TOE_GAMES_REL));
  }

  private @NonNull Link getOneGameLink() {
    return linkTo(methodOn(TicTacToeGameController.class).get(null)).withRel(TIC_TAC_TOE_GAME_REL);
  }

  private @NonNull Link getFindPlayersLink() {
    return linkTo(methodOn(TicTacToePlayerController.class).findPlayers(null)).withRel(TIC_TAC_TOE_PLAYERS_REL);
  }

  private Link getExpandedLink(Link link) {
    UriComponentsBuilder builder = fromUri(link.getTemplate().expand());
    TemplateVariables templateVariables = pageableResolver.getPaginationTemplateVariables(null, builder.build());
    UriTemplate template = UriTemplate.of(link.getHref()).with(templateVariables);
    return Link.of(template, link.getRel());
  }

  private @NonNull Link getCreateAffordance() {
    InputPayloadMetadataImpl metadata = new InputPayloadMetadataImpl();
    metadata.addProperty(
      PropertyMetadataImpl.builder().name("playerOUsername").inputType("text").required(true).build());
    metadata.addProperty(PropertyMetadataImpl.builder().name("isPrivate").inputType("boolean").required(false).build());

    if (hasAuthority(TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE)) {
      metadata.addProperty(
        PropertyMetadataImpl.builder().name("playerXUsername").inputType("text").required(false).build());
    }

    Link link = linkTo(methodOn(TicTacToeGameController.class).create(null)).withRel(
      TicTacToeRelations.TIC_TAC_TOE_CREATE_REL);
    return of(link).afford(HttpMethod.POST)
      .withName(TicTacToeRelations.TIC_TAC_TOE_CREATE_REL)
      .withTarget(link)
      .withInput(metadata)
      .build()
      .toLink();
  }
}
