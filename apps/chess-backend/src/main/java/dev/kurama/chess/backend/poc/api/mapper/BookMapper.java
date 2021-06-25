package dev.kurama.chess.backend.poc.api.mapper;

import dev.kurama.chess.backend.poc.api.domain.BookDTO;
import dev.kurama.chess.backend.poc.domain.Book;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper()
public interface BookMapper {

  @Mapping(target = "authorId", source = "author.id")
  BookDTO bookToBookDTO(Book book);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "author", ignore = true)
  Book bookDTOToBook(BookDTO bookDto);

  List<BookDTO> booksToBookDTOs(List<Book> books);

}
