package dev.kurama.api.core;

import dev.kurama.api.core.authority.DefaultAuthority;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.repository.AuthorityRepository;
import dev.kurama.api.core.repository.GlobalSettingsRepository;
import dev.kurama.api.core.repository.RoleRepository;
import dev.kurama.api.core.repository.UserRepository;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.stream.Collectors;

import static com.google.common.collect.Lists.newArrayList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class})
class InitializationRunnerTest {

  @Spy
  @InjectMocks
  private InitializationRunner initializationRunner;

  @Mock
  private UserRepository userRepository;

  @Mock
  private RoleRepository roleRepository;

  @Mock
  private AuthorityRepository authorityRepository;

  @Mock
  private GlobalSettingsRepository globalSettingsRepository;

  @Nested
  class RunnerTests {

    @Test
    void should_run_if_data_init_is_true() throws RoleNotFoundException {
      ReflectionTestUtils.setField(initializationRunner, "dataInit", true);

      doNothing().when(initializationRunner)
        .initializeAuthorities();
      doNothing().when(initializationRunner)
        .initializeRoles();
      doNothing().when(initializationRunner)
        .setRolesAuthorizations();
      doNothing().when(initializationRunner)
        .initializeGlobalSettings();
      doNothing().when(initializationRunner)
        .initializeAdminUser();

      initializationRunner.run();

      verify(initializationRunner).initializeAuthorities();
      verify(initializationRunner).initializeRoles();
      verify(initializationRunner).setRolesAuthorizations();
      verify(initializationRunner).initializeGlobalSettings();
      verify(initializationRunner).initializeAdminUser();
    }

    @Test
    void should_not_run_if_data_init_is_false() throws RoleNotFoundException {
      ReflectionTestUtils.setField(initializationRunner, "dataInit", false);

      initializationRunner.run();

      verify(initializationRunner, never()).initializeAuthorities();
      verify(initializationRunner, never()).initializeRoles();
      verify(initializationRunner, never()).setRolesAuthorizations();
      verify(initializationRunner, never()).initializeGlobalSettings();
      verify(initializationRunner, never()).initializeAdminUser();
    }
  }

  @Nested
  class InitializeAuthoritiesTests {
    @Captor
    ArgumentCaptor<Iterable<Authority>> capturedAuthorities;

    @Test
    void should_initialize_authorities() {
      doReturn(newArrayList()).when(authorityRepository)
        .findAll();

      initializationRunner.initializeAuthorities();

      verify(authorityRepository).saveAllAndFlush(capturedAuthorities.capture());
      assertThat(capturedAuthorities.getValue()).extracting("name")
        .containsExactlyInAnyOrderElementsOf(DefaultAuthority.AUTHORITIES);
    }

    @Test
    void should_insert_only_nonexistent_authorities() {
      List<Authority> existentAuthorities = buildAuthorities(DefaultAuthority.AUTHORITIES.subList(0, 3));
      doReturn(existentAuthorities).when(authorityRepository)
        .findAll();

      initializationRunner.initializeAuthorities();

      verify(authorityRepository).saveAllAndFlush(capturedAuthorities.capture());
      assertThat(capturedAuthorities.getValue()).hasSize(DefaultAuthority.AUTHORITIES.size() - existentAuthorities.size())
        .extracting("name")
        .doesNotContainAnyElementsOf(existentAuthorities);
    }

    @Test
    void should_not_insert_if_no_new_authorities() {
      List<Authority> existentAuthorities = buildAuthorities(DefaultAuthority.AUTHORITIES);
      doReturn(existentAuthorities).when(authorityRepository)
        .findAll();

      initializationRunner.initializeAuthorities();

      verify(authorityRepository, never()).saveAllAndFlush(any());
    }
  }

  @Nested
  class InitializeRolesTests {
    @Captor
    ArgumentCaptor<Iterable<Role>> capturedRoles;

    @Test
    void should_initialize_roles() {
      doReturn(newArrayList()).when(roleRepository)
        .findAll();

      initializationRunner.initializeRoles();

      verify(roleRepository).saveAllAndFlush(capturedRoles.capture());
      assertThat(capturedRoles.getValue()).extracting("name")
        .containsExactlyInAnyOrderElementsOf(DefaultAuthority.ROLES);
    }

    @Test
    void should_insert_only_nonexistent_roles() {
      List<Role> existentRoles = buildRoles(DefaultAuthority.ROLES.subList(0, 3));
      doReturn(existentRoles).when(roleRepository)
        .findAll();

      initializationRunner.initializeRoles();

      verify(roleRepository).saveAllAndFlush(capturedRoles.capture());
      assertThat(capturedRoles.getValue()).hasSize(DefaultAuthority.ROLES.size() - existentRoles.size())
        .extracting("name")
        .doesNotContainAnyElementsOf(existentRoles);
    }

    @Test
    void should_not_insert_if_no_new_roles() {
      List<Role> existentRoles = buildRoles(DefaultAuthority.ROLES);
      doReturn(existentRoles).when(roleRepository)
        .findAll();

      initializationRunner.initializeRoles();

      verify(roleRepository, never()).saveAllAndFlush(any());
    }
  }

  @Nested
  class SetRolesAuthorizationsTests {
    @Test
    void should_set_all_roles_authorities() {

    }
  }

  private List<Role> buildRoles(List<String> names) {
    return names
      .stream()
      .map(role -> Role.builder()
        .setRandomUUID()
        .name(role)
        .build())
      .collect(Collectors.toList());
  }

  private List<Authority> buildAuthorities(List<String> names) {
    return names
      .stream()
      .map(authority -> Authority.builder()
        .setRandomUUID()
        .name(authority)
        .build())
      .collect(Collectors.toList());
  }
}
