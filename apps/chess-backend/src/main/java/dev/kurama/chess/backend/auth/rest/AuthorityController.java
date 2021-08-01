package dev.kurama.chess.backend.auth.rest;

import static org.springframework.beans.support.PagedListHolder.DEFAULT_PAGE_SIZE;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.chess.backend.auth.api.domain.model.AuthorityModel;
import dev.kurama.chess.backend.auth.facade.AuthorityFacade;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/authority")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class AuthorityController {

  @NonNull
  private final AuthorityFacade authorityFacade;

  @GetMapping()
  @PreAuthorize("hasAuthority('authority:read')")
  public ResponseEntity<PagedModel<AuthorityModel>> getAll(
    @PageableDefault(page = 0, size = DEFAULT_PAGE_SIZE) Pageable pageable) {
    return ok().body(authorityFacade.getAll(pageable));
  }

  @GetMapping("/{authorityId}")
  @PreAuthorize("hasAuthority('authority:read')")
  public ResponseEntity<AuthorityModel> get(@PathVariable("authorityId") String authorityId) {
    return ok().body(authorityFacade.findByAuthorityId(authorityId));
  }
}
