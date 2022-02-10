package dev.kurama.api.core.service;

import static dev.kurama.api.core.authority.RoleAuthority.ROLE_UPDATE_CORE;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static java.util.Optional.ofNullable;
import static org.apache.logging.log4j.util.Strings.isEmpty;

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
import javax.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.ExampleMatcher.GenericPropertyMatchers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RoleService {

  @NonNull
  private final RoleRepository roleRepository;

  @NonNull
  private final RoleChangedEventEmitter roleChangedEventEmitter;

  @NonNull
  private final AuthorityService authorityService;

  private UserService userService;

  @Autowired
  public void setUserService(@NonNull UserService userService) {
    this.userService = userService;
  }

  private GlobalSettingsService globalSettingsService;

  @Autowired
  public void setGlobalSettingsService(@NonNull GlobalSettingsService globalSettingsService) {
    this.globalSettingsService = globalSettingsService;
  }

  public Optional<Role> findByName(String roleName) {
    return roleRepository.findByName(roleName);
  }

  public Page<Role> getAllRoles(Pageable pageable, String search) {
    if (isEmpty(search)) {
      return roleRepository.findAll(pageable);
    } else {
      return roleRepository.findAll(getRoleExample(search), pageable);
    }
  }

  public Optional<Role> findRoleById(String id) {
    return roleRepository.findById(id);
  }

  @Transactional
  public void delete(String id) throws ImmutableRoleException, RoleNotFoundException {
    Role role = findRoleById(id).orElseThrow(() -> new RoleNotFoundException(id));
    if (role.isCoreRole()) {
      throw new ImmutableRoleException(id);
    }
    userService.reassignToRole(role.getUsers(), globalSettingsService.getGlobalSettings().getDefaultRole());
    roleRepository.delete(role);
    roleChangedEventEmitter.emitRoleDeletedEvent(role.getId());
  }

  public Role create(@Length(min = 3, max = 128) String roleName) throws RoleExistsException {
    var parsedRoleName = parseRoleName(roleName);
    if (findByName(parsedRoleName).isPresent()) {
      throw new RoleExistsException(parsedRoleName);
    }
    var role = roleRepository.save(Role.builder().setRandomUUID().name(parsedRoleName).build());
    roleChangedEventEmitter.emitRoleCreatedEvent(role.getId());
    return role;
  }

  public Role update(String id, RoleUpdateInput roleUpdateInput) throws RoleNotFoundException, ImmutableRoleException {
    Role role = findRoleById(id).orElseThrow(() -> new RoleNotFoundException(id));
    if (role.isCoreRole() && !hasAuthority(ROLE_UPDATE_CORE)) {
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
        role.getAuthorities().stream().map(Authority::getId).collect(Collectors.toSet())))) {
      role.setAuthorities(authorityService.findAllById(roleUpdateInput.getAuthorityIds()));
      changed = true;
    }
    if (ofNullable(roleUpdateInput.getCanLogin()).isPresent() && !roleUpdateInput.getCanLogin()
      .equals(role.isCanLogin())) {
      role.setCanLogin(roleUpdateInput.getCanLogin());
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


  private Example<Role> getRoleExample(String search) {
    return Example.of(
      Role.builder().name(search).build(),
      ExampleMatcher.matchingAny()
        .withIgnorePaths("coreRole", "canLogin")
        .withMatcher("name", GenericPropertyMatchers.contains().ignoreCase()));
  }
}
