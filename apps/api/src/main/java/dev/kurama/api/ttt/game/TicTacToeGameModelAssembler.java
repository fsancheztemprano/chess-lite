package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.assembler.DomainModelAssembler;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.PagedModel;
import org.springframework.stereotype.Component;

@Component
public class TicTacToeGameModelAssembler extends DomainModelAssembler<TicTacToeGameModel> {

  @Override
  public @NonNull PagedModel<TicTacToeGameModel> toPagedModel(Page<TicTacToeGameModel> entities) {
    return (PagedModel<TicTacToeGameModel>) super.toPagedModel(entities)
      .mapLinkIf(hasAuthority(TicTacToeAuthority.TIC_TAC_TOE_ROOT), LinkRelation.of(SELF),
        link -> link.andAffordance(getCreateAffordance()));
  }

  private @NonNull Affordance getCreateAffordance() {
    return afford(methodOn(TicTacToeGameController.class).create(null));
  }
}
