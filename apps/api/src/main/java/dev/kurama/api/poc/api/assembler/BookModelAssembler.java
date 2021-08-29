package dev.kurama.api.poc.api.assembler;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.poc.authority.AuthorAuthority.AUTHOR_READ;
import static dev.kurama.api.poc.authority.BookAuthority.BOOK_CREATE;
import static dev.kurama.api.poc.authority.BookAuthority.BOOK_DELETE;
import static dev.kurama.api.poc.authority.BookAuthority.BOOK_UPDATE;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.assembler.DomainModelAssembler;
import dev.kurama.api.core.utility.AuthorityUtils;
import dev.kurama.api.poc.api.domain.model.BookModel;
import dev.kurama.api.poc.rest.AuthorController;
import dev.kurama.api.poc.rest.BookController;
import java.util.List;
import lombok.NonNull;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
public class BookModelAssembler extends DomainModelAssembler<BookModel> {

  protected Class<BookController> getClazz() {
    return BookController.class;
  }

  @Override
  public @NonNull
  BookModel toModel(@NonNull BookModel bookModel) {
    return bookModel
      .add(getModelSelfLink(bookModel.getId()))
      .add(getParentLink())
      .addIf(AuthorityUtils.hasAuthority(AUTHOR_READ) && !isEmpty(bookModel.getAuthorId()),
        () -> getAuthorLink(bookModel.getAuthorId()))
      .mapLinkIf(AuthorityUtils.hasAuthority(BOOK_DELETE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getDeleteAffordance(bookModel.getId())))
      .mapLinkIf(AuthorityUtils.hasAuthority(BOOK_UPDATE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateAffordance(bookModel.getId())))
      .mapLinkIf(AuthorityUtils.hasAuthority(BOOK_UPDATE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getSetAuthorAffordance(bookModel.getId())))
      ;
  }

  @Override
  public @NonNull
  CollectionModel<BookModel> toSelfCollectionModel(@NonNull Iterable<? extends BookModel> entities) {
    return super.toSelfCollectionModel(entities)
      .mapLinkIf(AuthorityUtils.hasAuthority(BOOK_CREATE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getCreateAffordance()))
      ;
  }

  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).get(id));
  }

  @Override
  public WebMvcLinkBuilder getAllLink() {
    return linkTo(methodOn(getClazz()).getAll());
  }

  public @NonNull
  CollectionModel<BookModel> toAuthorCollectionModel(@NonNull List<BookModel> entities,
    String authorId) {
    return toLinkedCollectionModel(entities, linkTo(methodOn(AuthorController.class).getAuthorBooks(authorId)))
      .mapLinkIf(AuthorityUtils.hasAuthority(BOOK_UPDATE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getAddAuthorBookAffordance(authorId)));
  }

  private @NonNull
  Link getAuthorLink(@NonNull String authorId) {
    return linkTo(methodOn(AuthorController.class).get(authorId)).withRel("author");
  }

  private @NonNull
  Affordance getAddAuthorBookAffordance(@NonNull String authorId) {
    return afford(methodOn(AuthorController.class).addBook(authorId, null));
  }

  private @NonNull
  Affordance getCreateAffordance() {
    return afford(methodOn(getClazz()).create(null));
  }

  private @NonNull
  Affordance getSetAuthorAffordance(@NonNull String id) {
    return afford(methodOn(getClazz()).setAuthor(id, null));
  }

  private @NonNull
  Affordance getDeleteAffordance(@NonNull String id) {
    return afford(methodOn(getClazz()).delete(id));
  }

  private @NonNull
  Affordance getUpdateAffordance(@NonNull String id) {
    return afford(methodOn(getClazz()).put(id, null));
  }

  private @NonNull
  Link getParentLink() {
    return linkTo(methodOn(getClazz()).getAll()).withRel("books");
  }
}
