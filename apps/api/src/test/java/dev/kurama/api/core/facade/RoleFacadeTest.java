package dev.kurama.api.core.facade;

import dev.kurama.api.core.hateoas.assembler.RoleModelAssembler;
import dev.kurama.api.core.mapper.RoleMapper;
import dev.kurama.api.core.service.RoleService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

class RoleFacadeTest {

  @InjectMocks
  private RoleFacade roleFacade;

  @Mock
  private RoleService roleService;

  @Mock
  private RoleMapper roleMapper;

  @Mock
  private RoleModelAssembler roleModelAssembler;

  @Test
  void getAll() {
  }

  @Test
  void findByRoleId() {
  }

  @Test
  void create() {
  }

  @Test
  void update() {
  }

  @Test
  void delete() {
  }
}
