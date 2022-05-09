package dev.kurama.api.core.service;

import static com.google.common.collect.Lists.newArrayList;
import static com.google.common.collect.Sets.newHashSet;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.authority.DefaultAuthority;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.repository.AuthorityRepository;
import dev.kurama.api.core.repository.GlobalSettingsRepository;
import dev.kurama.api.core.repository.RoleRepository;
import dev.kurama.api.core.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@ExtendWith({MockitoExtension.class})
class DataInitializationServiceTest {

  @Spy
  @InjectMocks
  private DataInitializationService service;

  @Mock
  private UserRepository userRepository;

  @Mock
  private RoleRepository roleRepository;

  @Mock
  private AuthorityRepository authorityRepository;

  @Mock
  private GlobalSettingsRepository globalSettingsRepository;

  @Mock
  private BCryptPasswordEncoder passwordEncoder;

  @BeforeEach
  void setUp() {
    lenient().doNothing().when(service).log(any(), anyString());
  }

  @Nested
  class InitializeTests {

    @Test
    void should_run_if_data_init_is_true() throws RoleNotFoundException {
      doNothing().when(service).initializeAuthorities();
      doNothing().when(service).initializeRoles();
      doNothing().when(service).setRolesAuthorizations();
      doNothing().when(service).initializeGlobalSettings();
      doNothing().when(service).initializeAdminUser();

      service.initialize();

      verify(service).initializeAuthorities();
      verify(service).initializeRoles();
      verify(service).setRolesAuthorizations();
      verify(service).initializeGlobalSettings();
      verify(service).initializeAdminUser();
    }

    @Test
    void should_catch_initialization_exceptions() throws RoleNotFoundException {
      doNothing().when(service).initializeAuthorities();
      doNothing().when(service).initializeRoles();
      doNothing().when(service).setRolesAuthorizations();
      doThrow(new RoleNotFoundException("")).when(service).initializeGlobalSettings();

      service.initialize();
    }
  }

  @Nested
  class InitializeAuthoritiesTests {

    @Captor
    ArgumentCaptor<Iterable<Authority>> capturedAuthorities;

    @Test
    void should_initialize_authorities() {
      doReturn(newArrayList()).when(authorityRepository).findAll();
      doReturn(DefaultAuthority.AUTHORITIES).when(authorityRepository).saveAllAndFlush(any());

      service.initializeAuthorities();

      verify(authorityRepository).saveAllAndFlush(capturedAuthorities.capture());
      assertThat(capturedAuthorities.getValue()).extracting("name")
        .containsExactlyInAnyOrderElementsOf(DefaultAuthority.AUTHORITIES);
    }

    @Test
    void should_insert_only_nonexistent_authorities() {
      List<Authority> existentAuthorities = buildAuthorities(DefaultAuthority.AUTHORITIES.subList(0, 3));
      doReturn(existentAuthorities).when(authorityRepository).findAll();

      service.initializeAuthorities();

      verify(authorityRepository).saveAllAndFlush(capturedAuthorities.capture());
      assertThat(capturedAuthorities.getValue()).hasSize(
          DefaultAuthority.AUTHORITIES.size() - existentAuthorities.size())
        .extracting("name")
        .doesNotContainAnyElementsOf(existentAuthorities);
    }

    @Test
    void should_not_insert_if_no_new_authorities() {
      List<Authority> existentAuthorities = buildAuthorities(DefaultAuthority.AUTHORITIES);
      doReturn(existentAuthorities).when(authorityRepository).findAll();

      service.initializeAuthorities();

      verify(authorityRepository, never()).saveAllAndFlush(any());
    }
  }

  @Nested
  class InitializeRolesTests {

    @Captor
    ArgumentCaptor<Iterable<Role>> capturedRoles;

    @Test
    void should_initialize_roles() {
      doReturn(newArrayList()).when(roleRepository).findAll();
      doReturn(DefaultAuthority.ROLES).when(roleRepository).saveAllAndFlush(any());

      service.initializeRoles();

      verify(roleRepository).saveAllAndFlush(capturedRoles.capture());
      assertThat(capturedRoles.getValue()).extracting("name")
        .containsExactlyInAnyOrderElementsOf(DefaultAuthority.ROLES);
    }

    @Test
    void should_insert_only_nonexistent_roles() {
      List<Role> existentRoles = buildRoles(DefaultAuthority.ROLES.subList(0, 3));
      doReturn(existentRoles).when(roleRepository).findAll();

      service.initializeRoles();

      verify(roleRepository).saveAllAndFlush(capturedRoles.capture());
      assertThat(capturedRoles.getValue()).hasSize(DefaultAuthority.ROLES.size() - existentRoles.size())
        .extracting("name")
        .doesNotContainAnyElementsOf(existentRoles);
    }

    @Test
    void should_not_insert_if_no_new_roles() {
      List<Role> existentRoles = buildRoles(DefaultAuthority.ROLES);
      doReturn(existentRoles).when(roleRepository).findAll();

      service.initializeRoles();

      verify(roleRepository, never()).saveAllAndFlush(any());
    }
  }

  @Nested
  class SetRolesAuthorizationsTests {

    @Captor
    ArgumentCaptor<Iterable<Role>> capturedRoles;

    @Test
    void should_set_all_roles_default_authorities() {
      List<Role> roles = buildRoles(DefaultAuthority.ROLES);
      List<Authority> authorities = buildAuthorities(DefaultAuthority.AUTHORITIES);
      doReturn(roles).when(roleRepository).findAll();
      doReturn(authorities).when(authorityRepository).findAll();
      doReturn(DefaultAuthority.ROLES).when(roleRepository).saveAllAndFlush(any());

      service.setRolesAuthorizations();

      verify(roleRepository).saveAllAndFlush(capturedRoles.capture());
      Iterable<Role> savedRoles = capturedRoles.getValue();
      assertThat(savedRoles).hasSize(DefaultAuthority.ROLES.size())
        .extracting("name")
        .containsExactlyInAnyOrderElementsOf(DefaultAuthority.ROLES);
      for (Role role : roles) {
        assertThat(role.getAuthorities()).extracting("name")
          .containsExactlyInAnyOrderElementsOf(DefaultAuthority.ROLE_AUTHORITIES.get(role.getName()));
      }
    }

    @Test
    void should_only_update_roles_missing_any_of_its_default_authorities() {
      List<Authority> authorities = buildAuthorities(DefaultAuthority.AUTHORITIES);
      List<Role> roles = buildRolesWithAuthorities(DefaultAuthority.ROLES, DefaultAuthority.ROLE_AUTHORITIES,
        authorities);
      roles.get(0).getAuthorities().clear();
      roles.get(1).getAuthorities().clear();
      doReturn(roles).when(roleRepository).findAll();
      doReturn(authorities).when(authorityRepository).findAll();

      service.setRolesAuthorizations();

      verify(roleRepository).saveAllAndFlush(capturedRoles.capture());
      Iterable<Role> savedRoles = capturedRoles.getValue();
      assertThat(savedRoles).hasSize(2)
        .extracting("name")
        .containsExactlyInAnyOrder(roles.get(0).getName(), roles.get(1).getName());
      for (Role role : roles) {
        assertThat(role.getAuthorities()).extracting("name")
          .containsExactlyInAnyOrderElementsOf(DefaultAuthority.ROLE_AUTHORITIES.get(role.getName()));
      }
    }

    @Test
    void should_not_insert_if_no_new_authorities() {
      List<Authority> authorities = buildAuthorities(DefaultAuthority.AUTHORITIES);
      List<Role> roles = buildRolesWithAuthorities(DefaultAuthority.ROLES, DefaultAuthority.ROLE_AUTHORITIES,
        authorities);
      doReturn(authorities).when(authorityRepository).findAll();
      doReturn(roles).when(roleRepository).findAll();

      service.setRolesAuthorizations();

      verify(authorityRepository, never()).saveAllAndFlush(any());
    }
  }

  @Nested
  class InitializeGlobalSettingsTests {

    @Captor
    ArgumentCaptor<GlobalSettings> capturedGlobalSettings;

    @Test
    void should_do_nothing_if_exactly_one_global_settings_exists() throws RoleNotFoundException {
      doReturn(1L).when(globalSettingsRepository).count();

      service.initializeGlobalSettings();

      verify(globalSettingsRepository, never()).deleteAll();
      verify(globalSettingsRepository, never()).saveAndFlush(any());
    }

    @Test
    void should_create_one_global_settings_if_none_are_available() throws RoleNotFoundException {
      Role defaultRole = Role.builder().setRandomUUID().build();
      doReturn(0L).when(globalSettingsRepository).count();
      doReturn(Optional.of(defaultRole)).when(roleRepository).findByName(DefaultAuthority.DEFAULT_ROLE);

      service.initializeGlobalSettings();

      verify(globalSettingsRepository, never()).deleteAll();
      verify(globalSettingsRepository).saveAndFlush(capturedGlobalSettings.capture());
      assertThat(capturedGlobalSettings.getValue()).extracting("id", "signupOpen", "defaultRole.id")
        .containsExactly(GlobalSettings.UNIQUE_ID, false, defaultRole.getId());
    }

    @Test
    void should_surplus_global_settings_if_more_than_one_available() throws RoleNotFoundException {
      Role defaultRole = Role.builder().setRandomUUID().build();
      doReturn(2L).when(globalSettingsRepository).count();
      doReturn(Optional.of(defaultRole)).when(roleRepository).findByName(DefaultAuthority.DEFAULT_ROLE);

      service.initializeGlobalSettings();

      verify(globalSettingsRepository, times(1)).deleteAll();
      verify(globalSettingsRepository).saveAndFlush(capturedGlobalSettings.capture());
      assertThat(capturedGlobalSettings.getValue()).extracting("id", "signupOpen", "defaultRole.id")
        .containsExactly(GlobalSettings.UNIQUE_ID, false, defaultRole.getId());
    }
  }

  @Nested
  class InitializeAdminUserTests {

    @Captor
    ArgumentCaptor<User> capturedUser;

    @Test
    void should_do_nothing_if_users_exists() throws RoleNotFoundException {
      doReturn(1L).when(userRepository).count();

      service.initializeAdminUser();

      verify(userRepository, never()).saveAllAndFlush(any());
    }

    @Test
    void should_create_admin_user_if_no_user_exists() throws RoleNotFoundException {
      Role superAdminRole = Role.builder()
        .setRandomUUID()
        .name(DefaultAuthority.SUPER_ADMIN_ROLE)
        .authorities(newHashSet(Authority.builder().setRandomUUID().name("ADMIN").build(),
          Authority.builder().setRandomUUID().name("SUPER_ADMIN").build()))
        .build();
      doReturn(0L).when(userRepository).count();
      doReturn(Optional.of(superAdminRole)).when(roleRepository).findByName(DefaultAuthority.SUPER_ADMIN_ROLE);
      String encodedPassword = randomAlphanumeric(8);
      doReturn(encodedPassword).when(passwordEncoder).encode("123456");

      service.initializeAdminUser();

      verify(userRepository).saveAndFlush(capturedUser.capture());
      User newAdminUser = capturedUser.getValue();
      assertThat(newAdminUser).extracting("username", "email", "password", "active", "locked", "expired",
        "credentialsExpired").containsExactly("admin", "admin@localhost", encodedPassword, true, false, false, false);
      assertThat(newAdminUser.getRole()).isEqualTo(superAdminRole);
      assertThat(newAdminUser.getAuthorities()).isEqualTo(superAdminRole.getAuthorities());
      assertNotNull(newAdminUser.getUserPreferences());
    }
  }

  private List<Role> buildRoles(List<String> names) {
    return names.stream().map(role -> Role.builder().setRandomUUID().name(role).build()).collect(Collectors.toList());
  }

  private List<Authority> buildAuthorities(List<String> names) {
    return names.stream()
      .map(authority -> Authority.builder().setRandomUUID().name(authority).build())
      .collect(Collectors.toList());
  }

  private List<Role> buildRolesWithAuthorities(List<String> names,
                                               Map<String, List<String>> roleAuthorities,
                                               List<Authority> authorities) {
    List<Role> roles = buildRoles(names);
    for (Role role : roles) {
      List<String> defaultRoleAuthorities = roleAuthorities.get(role.getName());
      role.setAuthorities(newHashSet(authorities.stream()
        .filter(authority -> defaultRoleAuthorities.contains(authority.getName()))
        .collect(Collectors.toSet())));
    }
    return roles;
  }
}
