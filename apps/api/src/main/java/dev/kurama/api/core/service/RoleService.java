package dev.kurama.api.core.service;

import static org.apache.logging.log4j.util.Strings.isEmpty;

import dev.kurama.api.core.authority.DefaultAuthority;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.RoleInput;
import dev.kurama.api.core.repository.RoleRepository;
import java.util.Optional;
import java.util.stream.Collectors;
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

  @NonNull
  private final AuthorityService authorityService;

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

  public void delete(String id) throws ImmutableRoleException, RoleNotFoundException {
    Role role = roleRepository.findRoleById(id).orElseThrow(() -> new RoleNotFoundException(id));
    if (role.isCoreRole()) {
      throw new ImmutableRoleException(id);
    }
    roleRepository.delete(role);
  }

  public Role create(@NonNull RoleInput roleInput) throws RoleExistsException {
    if (findByName(roleInput.getName()).isPresent()) {
      throw new RoleExistsException(roleInput.getName());
    }
    return roleRepository.save(Role.builder().setRandomUUID().name(parseRoleName(roleInput.getName())).build());
  }

  public Role update(String id, RoleInput roleInput) throws RoleNotFoundException, ImmutableRoleException {
    Role role = roleRepository.findRoleById(id).orElseThrow(() -> new RoleNotFoundException(id));
    if (role.isCoreRole()) {
      throw new ImmutableRoleException(id);
    }
    boolean changed = false;
    if (!isEmpty(roleInput.getName()) && !role.getName().equals(roleInput.getName())) {
      role.setName(parseRoleName(roleInput.getName()));
      changed = true;
    }
    if (roleInput.getAuthorityIds() != null &&
      (roleInput.getAuthorityIds().size() != role.getAuthorities().size()
        || !roleInput.getAuthorityIds().containsAll(
        role.getAuthorities().stream().map(Authority::getName).collect(Collectors.toSet())))) {
      role.setAuthorities(authorityService.findAllById(roleInput.getAuthorityIds()));
      changed = true;
    }
    if (changed) {
      role = roleRepository.saveAndFlush(role);
    }
    return role;
  }

  private String parseRoleName(String name) {
    return (name + "").toUpperCase().replace(" ", "_");
  }
}
