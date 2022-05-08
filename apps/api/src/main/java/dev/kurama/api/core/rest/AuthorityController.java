package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.AUTHORITY_PATH;
import static org.springframework.beans.support.PagedListHolder.DEFAULT_PAGE_SIZE;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.api.core.facade.AuthorityFacade;
import dev.kurama.api.core.hateoas.model.AuthorityModel;
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
@RequestMapping(AUTHORITY_PATH)
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class AuthorityController {

  @NonNull
  private final AuthorityFacade authorityFacade;

  @GetMapping()
  @PreAuthorize("hasAuthority(@AuthorityAuthority.AUTHORITY_READ)")
  public ResponseEntity<PagedModel<AuthorityModel>> getAll(@PageableDefault(page = 0, size = DEFAULT_PAGE_SIZE) Pageable pageable) {
    return ok().body(authorityFacade.getAll(pageable));
  }

  @GetMapping("/{authorityId}")
  @PreAuthorize("hasAuthority(@AuthorityAuthority.AUTHORITY_READ)")
  public ResponseEntity<AuthorityModel> get(@PathVariable("authorityId") String authorityId)
    throws EntityNotFoundException {
    return ok().body(authorityFacade.findByAuthorityId(authorityId));
  }
}
