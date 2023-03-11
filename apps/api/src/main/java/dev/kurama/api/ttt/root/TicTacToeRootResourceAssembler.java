package dev.kurama.api.ttt.root;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.ROOT_REL;
import static dev.kurama.api.core.utility.HateoasUtils.withDefaultAffordance;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_GAMES_REL;
import static dev.kurama.api.ttt.core.TicTacToeRelations.TIC_TAC_TOE_GAME_REL;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.web.util.UriComponentsBuilder.fromUri;

import dev.kurama.api.core.hateoas.root.model.RootResource;
import dev.kurama.api.core.hateoas.root.processor.RootAssembler;
import dev.kurama.api.core.hateoas.root.rest.RootController;
import dev.kurama.api.ttt.game.TicTacToeGameController;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.TemplateVariables;
import org.springframework.hateoas.UriTemplate;
import org.springframework.hateoas.mediatype.hal.HalModelBuilder;
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
      .link(getOneGameLink());

    RepresentationModel<RootResource> model = rootModel.build();
    model.mapLink(LinkRelation.of(TIC_TAC_TOE_GAMES_REL), link -> link.andAffordance(getCreateAffordance()));
    return model;
  }

  private @NonNull Link getSelfLink() {
    return withDefaultAffordance(linkTo(methodOn(TicTacToeRootController.class).root()).withSelfRel());
  }

  private @NonNull Link getParentLink() {
    return linkTo(methodOn(RootController.class).root()).withRel(ROOT_REL);
  }

  private @NonNull Link getAllGamesLink() {
    return getExpandedLink(
      linkTo(methodOn(TicTacToeGameController.class).getAll(null, null, null, null)).withRel(TIC_TAC_TOE_GAMES_REL));
  }

  private @NonNull Link getOneGameLink() {
    return linkTo(methodOn(TicTacToeGameController.class).get(null)).withRel(TIC_TAC_TOE_GAME_REL);
  }

  private Link getExpandedLink(Link link) {
    UriComponentsBuilder builder = fromUri(link.getTemplate().expand());
    TemplateVariables templateVariables = pageableResolver.getPaginationTemplateVariables(null, builder.build());
    UriTemplate template = UriTemplate.of(link.getHref()).with(templateVariables);
    return Link.of(template, link.getRel());
  }

  private @NonNull Affordance getCreateAffordance() {
    return afford(methodOn(TicTacToeGameController.class).create(null));
  }
}
