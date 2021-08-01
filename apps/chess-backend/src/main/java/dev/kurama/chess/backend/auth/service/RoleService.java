package dev.kurama.chess.backend.auth.service;

import dev.kurama.chess.backend.auth.authority.DefaultAuthority;
import dev.kurama.chess.backend.auth.domain.Role;
import dev.kurama.chess.backend.auth.repository.RoleRepository;
import java.util.Optional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RoleService {

  @NonNull
  private final RoleRepository roleRepository;

  public Optional<Role> getDefaultRole() {
    return roleRepository.findByName(DefaultAuthority.DEFAULT_ROLE);
  }

  public Optional<Role> findByName(String roleName) {
    return roleRepository.findByName(roleName);
  }

  public Page<Role> getAllRoles(Pageable pageable) {
    return roleRepository.findAll(pageable);
  }

  public Optional<Role> findRoleById(String id) {
    return roleRepository.findRoleById(id);
  }

}
