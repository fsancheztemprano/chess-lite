package dev.kurama.api.core.facade;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.assembler.RoleModelAssembler;
import dev.kurama.api.core.hateoas.input.RoleUpdateInput;
import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.mapper.RoleMapper;
import dev.kurama.api.core.service.RoleFacility;
import dev.kurama.api.core.service.RoleService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.hateoas.PagedModel;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
class RoleFacadeTest {

  @InjectMocks
  private RoleFacade roleFacade;

  @Mock
  private RoleService roleService;

  @Mock
  private RoleFacility roleFacility;

  @Mock
  private RoleMapper roleMapper;

  @Mock
  private RoleModelAssembler roleModelAssembler;

  @Test
  void should_get_all_roles() {
    PageRequest PAGEABLE = PageRequest.of(1, 2);
    PageImpl<Role> pagedRoles = new PageImpl<>(newArrayList(Role.builder()
      .build()), PAGEABLE, 1);
    PageImpl<RoleModel> roleModels = new PageImpl<>(newArrayList(RoleModel.builder()
      .build()), PAGEABLE, 1);
    PagedModel<RoleModel> expected = PagedModel.of(roleModels.getContent(),
      new PagedModel.PageMetadata(2, 1, 2));
    when(roleService.getAllRoles(PAGEABLE, "")).thenReturn(pagedRoles);
    when(roleMapper.rolePageToRoleModelPage(pagedRoles)).thenReturn(roleModels);
    when(roleModelAssembler.toPagedModel(roleModels)).thenReturn(expected);

    PagedModel<RoleModel> actual = roleFacade.getAll(PAGEABLE, "");

    verify(roleService).getAllRoles(PAGEABLE, "");
    verify(roleMapper).rolePageToRoleModelPage(pagedRoles);
    verify(roleModelAssembler).toPagedModel(roleModels);
    assertEquals(expected, actual);
  }

  @Test
  void should_find_by_role_id() throws RoleNotFoundException {
    Role role = Role.builder()
      .name("TEST_ROLE")
      .setRandomUUID()
      .build();
    RoleModel expected = RoleModel.builder()
      .name(role.getName())
      .id(role.getId())
      .build();
    when(roleService.findRoleById(role.getId())).thenReturn(Optional.of(role));
    when(roleMapper.roleToRoleModel(role)).thenReturn(expected);

    RoleModel actual = roleFacade.findByRoleId(role.getId());

    verify(roleService).findRoleById(role.getId());
    verify(roleMapper).roleToRoleModel(role);
    assertEquals(expected, actual);
  }

  @Test
  void should_call_service_to_create_role() throws RoleExistsException {
    Role role = Role.builder()
      .name("TEST_ROLE")
      .setRandomUUID()
      .build();
    RoleModel expected = RoleModel.builder()
      .name(role.getName())
      .id(role.getId())
      .build();
    when(roleService.create(role.getName())).thenReturn(role);
    when(roleMapper.roleToRoleModel(role)).thenReturn(expected);

    RoleModel actual = roleFacade.create(role.getName());

    verify(roleService).create(role.getName());
    verify(roleMapper).roleToRoleModel(role);
    assertEquals(expected, actual);
  }

  @Test
  void should_call_service_to_update_role() throws ImmutableRoleException, RoleNotFoundException {
    String id = randomUUID();
    RoleUpdateInput input = RoleUpdateInput.builder()
      .name("TEST_ROLE")
      .build();
    Role role = Role.builder()
      .name(input.getName())
      .setRandomUUID()
      .build();
    RoleModel expected = RoleModel.builder()
      .name(role.getName())
      .id(role.getId())
      .build();
    when(roleService.update(id, input)).thenReturn(role);
    when(roleMapper.roleToRoleModel(role)).thenReturn(expected);

    RoleModel actual = roleFacade.update(id, input);

    verify(roleService).update(id, input);
    verify(roleMapper).roleToRoleModel(role);
    assertEquals(expected, actual);
  }

  @Test
  void should_call_service_to_delete_role() throws ImmutableRoleException, RoleNotFoundException {
    String id = randomUUID();
    roleFacade.delete(id);

    verify(roleFacility).deleteRole(id);
  }
}
