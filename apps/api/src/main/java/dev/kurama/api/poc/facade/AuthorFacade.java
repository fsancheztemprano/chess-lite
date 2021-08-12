package dev.kurama.api.poc.facade;

import dev.kurama.api.poc.api.domain.input.AuthorInput;
import dev.kurama.api.poc.api.domain.model.AuthorModel;
import dev.kurama.api.poc.api.mapper.AuthorMapper;
import dev.kurama.api.poc.service.AuthorService;
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

  public AuthorModel findById(String id) {
    return authorMapper.authorToAuthorModel(authorService.findById(id));
  }

  public void deleteById(String id) {
    authorService.deleteById(id);
  }

  public AuthorModel addBook(String authorId, String bookId) {
    return authorMapper.authorToAuthorModel(authorService.addBook(authorId, bookId));
  }

  public AuthorModel put(String id, AuthorInput authorInput) {
    return authorMapper.authorToAuthorModel(authorService.put(id, authorMapper.authorInputToAuthor(authorInput)));
  }
}
