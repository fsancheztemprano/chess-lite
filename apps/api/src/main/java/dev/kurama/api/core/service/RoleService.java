package dev.kurama.api.core.service;

import static org.apache.logging.log4j.util.Strings.isEmpty;

import dev.kurama.api.core.authority.DefaultAuthority;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.event.emitter.RoleChangedEventEmitter;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.RoleUpdateInput;
import dev.kurama.api.core.repository.RoleRepository;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.Length;
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

  @NonNull
  private final RoleChangedEventEmitter roleChangedEventEmitter;

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
    roleChangedEventEmitter.emitRoleDeletedEvent(role.getId());
  }

  public Role create(@Length(min = 3, max = 128) String roleName) throws RoleExistsException {
    if (findByName(roleName).isPresent()) {
      throw new RoleExistsException(roleName);
    }
    var role = roleRepository.save(Role.builder().setRandomUUID().name(parseRoleName(roleName)).build());
    roleChangedEventEmitter.emitRoleCreatedEvent(role.getId());
    return role;
  }

  public Role update(String id, RoleUpdateInput roleUpdateInput) throws RoleNotFoundException, ImmutableRoleException {
    Role role = roleRepository.findRoleById(id).orElseThrow(() -> new RoleNotFoundException(id));
    if (role.isCoreRole()) {
      throw new ImmutableRoleException(id);
    }
    boolean changed = false;
    if (!isEmpty(roleUpdateInput.getName()) && !role.getName().equals(roleUpdateInput.getName())) {
      role.setName(parseRoleName(roleUpdateInput.getName()));
      changed = true;
    }
    if (roleUpdateInput.getAuthorityIds() != null &&
      (roleUpdateInput.getAuthorityIds().size() != role.getAuthorities().size()
        || !roleUpdateInput.getAuthorityIds().containsAll(
        role.getAuthorities().stream().map(Authority::getName).collect(Collectors.toSet())))) {
      role.setAuthorities(authorityService.findAllById(roleUpdateInput.getAuthorityIds()));
      changed = true;
    }
    if (changed) {
      role = roleRepository.saveAndFlush(role);
      roleChangedEventEmitter.emitRoleUpdatedEvent(role.getId());
    }
    return role;
  }

  private String parseRoleName(String name) {
    return (name + "").toUpperCase().replace(" ", "_");
  }
}
