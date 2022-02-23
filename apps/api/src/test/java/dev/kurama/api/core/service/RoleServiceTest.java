package dev.kurama.api.core.service;

import static com.google.common.collect.Lists.newArrayList;
import static com.google.common.collect.Sets.newHashSet;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.data.domain.Sort.Direction.ASC;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.event.emitter.RoleChangedEventEmitter;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.RoleUpdateInput;
import dev.kurama.api.core.repository.RoleRepository;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class RoleServiceTest {

  @InjectMocks
  private RoleService roleService;

  @Mock
  private RoleRepository roleRepository;

  @Mock
  private RoleChangedEventEmitter roleChangedEventEmitter;

  @Mock
  private AuthorityService authorityService;

  @Test
  void should_find_by_name() {
    Role expected = Role.builder().setRandomUUID().name("ROLE_NAME").build();
    when(roleRepository.findByName(expected.getName())).thenReturn(Optional.of(expected));

    Optional<Role> actual = roleService.findByName(expected.getName());

    verify(roleRepository).findByName(expected.getName());
    assertThat(actual).isPresent().get().isEqualTo(expected);
  }

  @Nested
  class GetAllRolesTests {

    @Test
    void should_get_all_roles() {
      PageRequest pageable = PageRequest.of(1, 2, Sort.by(ASC, "id"));
      Role role = Role.builder().setRandomUUID().build();
      when(roleRepository.findAll(pageable)).thenReturn(new PageImpl<Role>(newArrayList(role)));

      Page<Role> actual = roleService.getAllRoles(pageable, "");

      verify(roleRepository).findAll(pageable);
      assertThat(actual).isNotNull();
      assertThat(actual.getContent().get(0).getId()).isEqualTo(role.getId());
    }

    @Test
    void should_get_roles_filtered_by_name() {
      PageRequest pageable = PageRequest.of(1, 2, Sort.by(ASC, "id"));
      Role roleB1 = Role.builder().setRandomUUID().name("ROLE_B1").build();
      Role roleB2 = Role.builder().setRandomUUID().name("ROLE_B2").build();
      when(roleRepository.findAll(any(Example.class), eq(pageable))).thenReturn(
        new PageImpl<Role>(newArrayList(roleB1, roleB2)));

      Page<Role> actual = roleService.getAllRoles(pageable, "ROLE_B");

      verify(roleRepository).findAll(any(Example.class), eq(pageable));
      assertThat(actual).isNotNull();
      assertThat(actual.getContent().get(0).getId()).isEqualTo(roleB1.getId());
      assertThat(actual.getContent().get(1).getId()).isEqualTo(roleB2.getId());
    }
  }

  @Test
  void should_find_role_by_id() {
    Role expected = Role.builder().setRandomUUID().build();
    when(roleRepository.findById(expected.getId())).thenReturn(Optional.of(expected));

    Optional<Role> actual = roleService.findRoleById(expected.getId());

    verify(roleRepository).findById(expected.getId());
    assertThat(actual).isPresent().get().isEqualTo(expected);
  }

  @Test
  void should_delete_role_by_id() {
    Role expected = Role.builder().setRandomUUID().build();
    roleService.delete(expected);

    verify(roleRepository).delete(expected);
    verify(roleChangedEventEmitter).emitRoleDeletedEvent(expected.getId());
  }

  @Nested
  class CreateRoleTests {

    @Test
    void should_create_role() throws RoleExistsException {
      String roleName = "ROLE_NAME";
      when(roleRepository.findByName(roleName)).thenReturn(Optional.empty());
      Role expected = Role.builder().setRandomUUID().name(roleName).build();
      when(roleRepository.save(any(Role.class))).thenReturn(expected);

      Role actual = roleService.create("role name");

      verify(roleRepository).save(any(Role.class));
      verify(roleChangedEventEmitter).emitRoleCreatedEvent(actual.getId());
      assertThat(actual).isNotNull().hasFieldOrPropertyWithValue("name", roleName);
    }

    @Test
    void should_throw_if_role_name_exists() {
      Role expected = Role.builder().setRandomUUID().name("ROLE_NAME").build();
      when(roleRepository.findByName(expected.getName())).thenReturn(Optional.of(expected));

      assertThrows(RoleExistsException.class, () -> roleService.create(expected.getName()));
    }
  }

  @Nested
  class UpdateRoleTests {

    @Test
    void should_update_role_authorities() throws ImmutableRoleException, RoleNotFoundException {
      Authority authority1 = Authority.builder().setRandomUUID().name("authority1").build();
      Authority authority2 = Authority.builder().setRandomUUID().name("authority2").build();
      Authority authority3 = Authority.builder().setRandomUUID().name("authority3").build();
      Role expected = Role.builder()
        .setRandomUUID()
        .coreRole(false)
        .name("ROLE_NAME")
        .canLogin(false)
        .authorities(newHashSet(authority1))
        .build();
      RoleUpdateInput input = RoleUpdateInput.builder()
        .authorityIds(newHashSet(authority2.getId(), authority3.getId()))
        .build();
      when(roleRepository.findById(expected.getId())).thenReturn(Optional.of(expected));
      when(authorityService.findAllById(input.getAuthorityIds())).thenReturn(newHashSet(authority2, authority3));
      when(roleRepository.saveAndFlush(expected)).thenReturn(expected);

      Role actual = roleService.update(expected.getId(), input);

      verify(roleRepository).saveAndFlush(expected);
      verify(authorityService).findAllById(input.getAuthorityIds());
      verify(roleChangedEventEmitter).emitRoleUpdatedEvent(actual.getId());
      assertEquals(expected, actual);
      assertEquals(2, actual.getAuthorities().size());
      assertTrue(actual.getAuthorities().contains(authority2));
      assertTrue(actual.getAuthorities().contains(authority3));
    }

    @Test
    void should_update_role_name_and_can_login() throws ImmutableRoleException, RoleNotFoundException {
      Authority authority = Authority.builder().setRandomUUID().name("authority").build();
      Role expected = Role.builder()
        .setRandomUUID()
        .coreRole(false)
        .name("ROLE_NAME")
        .canLogin(false)
        .authorities(newHashSet(authority))
        .build();
      RoleUpdateInput input = RoleUpdateInput.builder().name("role new name").canLogin(true).build();
      when(roleRepository.findById(expected.getId())).thenReturn(Optional.of(expected));
      when(roleRepository.saveAndFlush(expected)).thenReturn(expected);

      Role actual = roleService.update(expected.getId(), input);

      verifyNoInteractions(authorityService);
      verify(roleRepository).saveAndFlush(expected);
      verify(roleChangedEventEmitter).emitRoleUpdatedEvent(actual.getId());
      assertEquals(expected, actual);
      assertThat(actual.isCanLogin()).isEqualTo(input.getCanLogin());
      assertThat(actual.getName()).isEqualTo("ROLE_NEW_NAME");
    }

    @Test
    void should_not_update_if_nothing_has_changed() throws ImmutableRoleException, RoleNotFoundException {
      Authority authority = Authority.builder().setRandomUUID().name("authority").build();
      Role expected = Role.builder()
        .setRandomUUID()
        .coreRole(false)
        .name("ROLE_NAME")
        .canLogin(false)
        .authorities(newHashSet(authority))
        .build();
      RoleUpdateInput input = RoleUpdateInput.builder()
        .name(expected.getName())
        .authorityIds(newHashSet(authority.getId()))
        .canLogin(false)
        .build();
      when(roleRepository.findById(expected.getId())).thenReturn(Optional.of(expected));

      Role actual = roleService.update(expected.getId(), input);

      verifyNoInteractions(authorityService, roleChangedEventEmitter);
      verify(roleRepository, never()).saveAndFlush(any());
      assertEquals(expected, actual);
    }

    @Test
    void should_throw_if_role_is_immutable() {
      Role expected = Role.builder().setRandomUUID().coreRole(true).build();
      when(roleRepository.findById(expected.getId())).thenReturn(Optional.of(expected));

      assertThrows(ImmutableRoleException.class,
        () -> roleService.update(expected.getId(), RoleUpdateInput.builder().build()));
    }
  }
}
