package dev.kurama.chess.backend.poc.api.mapper;

import dev.kurama.chess.backend.poc.api.domain.input.AuthorInput;
import dev.kurama.chess.backend.poc.api.domain.output.AuthorModel;
import dev.kurama.chess.backend.poc.domain.Author;
import dev.kurama.chess.backend.poc.domain.Book;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper()
public interface AuthorMapper {

  @Mapping(target = "bookIds", source = "books")
  AuthorModel authorToAuthorModel(Author author);

  //  @Mapping(target = "id", ignore = true)
//  @Mapping(target = "books", ignore = true)
  Author authorInputToAuthor(AuthorInput authorInput);

  default Long bookToBookId(Book book) {
    return book.getId();
  }

  List<AuthorModel> authorsToAuthorModels(List<Author> authors);
}
