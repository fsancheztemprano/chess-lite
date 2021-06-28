package dev.kurama.chess.backend.poc.facade;

import dev.kurama.chess.backend.poc.api.domain.input.AuthorInput;
import dev.kurama.chess.backend.poc.api.domain.output.AuthorModel;
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

  public List<AuthorModel> findAll() {
    return authorMapper.authorsToAuthorModels(authorService.findAll());
  }

  public AuthorModel create(AuthorInput authorModel) {
    return authorMapper.authorToAuthorModel(authorService.create(authorMapper.authorInputToAuthor(authorModel)));
  }

  public AuthorModel findById(Long id) {
    return authorMapper.authorToAuthorModel(authorService.findById(id));
  }

  public void deleteById(long id) {
    authorService.deleteById(id);
  }

  public AuthorModel addBook(Long authorId, Long bookId) {
    return authorMapper.authorToAuthorModel(authorService.addBook(authorId, bookId));
  }

  public AuthorModel put(Long id, AuthorInput authorInput) {
    return authorMapper.authorToAuthorModel(authorService.put(id, authorMapper.authorInputToAuthor(authorInput)));
  }
}
