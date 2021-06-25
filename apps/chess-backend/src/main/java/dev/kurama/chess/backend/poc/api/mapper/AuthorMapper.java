package dev.kurama.chess.backend.poc.api.mapper;

import dev.kurama.chess.backend.poc.api.domain.AuthorDTO;
import dev.kurama.chess.backend.poc.domain.Author;
import dev.kurama.chess.backend.poc.domain.Book;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper()
public interface AuthorMapper {

  @Mapping(target = "bookIds", source = "books")
  AuthorDTO authorToAuthorDTO(Author author);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "books", ignore = true)
  Author authorDTOToAuthor(AuthorDTO authorDto);

  default Long bookToBookId(Book book) {
    return book.getId();
  }

  List<AuthorDTO> authorsToAuthorDTOs(List<Author> authors);
}
