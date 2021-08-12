package dev.kurama.api.poc.api.mapper;

import dev.kurama.api.poc.api.domain.input.AuthorInput;
import dev.kurama.api.poc.api.domain.model.AuthorModel;
import dev.kurama.api.poc.domain.Author;
import dev.kurama.api.poc.domain.Book;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper()
public interface AuthorMapper {

  @Mapping(target = "bookIds", source = "books")
  AuthorModel authorToAuthorModel(Author author);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "tid", ignore = true)
  @Mapping(target = "books", ignore = true)
  Author authorInputToAuthor(AuthorInput authorInput);

  default String bookToBookId(Book book) {
    return book.getId();
  }

  List<AuthorModel> authorsToAuthorModels(List<Author> authors);
}
