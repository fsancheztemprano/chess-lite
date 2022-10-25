package dev.kurama.api.core.service;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.repository.AuthorityRepository;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthorityService {

  @NonNull
  private final AuthorityRepository authorityRepository;

  public Set<Authority> findAllById(Collection<String> authorityIds) {
    return authorityRepository.findAllByIdIn(authorityIds);
  }

  public Page<Authority> getAllAuthorities(Pageable pageable) {
    return authorityRepository.findAll(pageable);
  }

  public Optional<Authority> findAuthorityById(String id) {
    return authorityRepository.findById(id);
  }
}
