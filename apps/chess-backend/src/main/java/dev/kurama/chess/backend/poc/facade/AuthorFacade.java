package dev.kurama.chess.backend.poc.facade;

import dev.kurama.chess.backend.poc.api.domain.AuthorDTO;
import dev.kurama.chess.backend.poc.api.mapper.AuthorMapper;
import dev.kurama.chess.backend.poc.service.AuthorService;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AuthorFacade {

  @NonNull
  private final AuthorService authorService;

  @NonNull
  private final AuthorMapper authorMapper;

  public List<AuthorDTO> findAll() {
    return authorMapper.authorsToAuthorDTOs(authorService.findAll());
  }

  public AuthorDTO create(AuthorDTO authorDTO) {
    return authorMapper.authorToAuthorDTO(authorService.create(authorMapper.authorDTOToAuthor(authorDTO)));
  }

  public AuthorDTO findById(Long id) {
    return authorMapper.authorToAuthorDTO(authorService.findById(id));
  }

  public void deleteById(long id) {
    authorService.deleteById(id);
  }

  public AuthorDTO addBook(Long authorId, Long bookId) {
    return authorMapper.authorToAuthorDTO(authorService.addBook(authorId, bookId));
  }

}
