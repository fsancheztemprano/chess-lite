import { Component } from '@angular/core';
import { UserManagementRelations } from '@app/domain';
import { CoreService } from '../../../../../../../core/services/core.service';
import { TiledMenuTileData } from '../../../../../../../shared/modules/tiled-menu/components/tiled-menu-tile/tiled-menu-tile.component';
import { RoleManagementService } from '../../../services/role-management.service';

@Component({
  selector: 'app-role-management-home',
  templateUrl: './role-management-home.component.html',
  styleUrls: ['./role-management-home.component.scss'],
})
export class RoleManagementHomeComponent {
  tiles: TiledMenuTileData[] = [
    {
      icon: 'format_list_bulleted',
      title: 'Role List',
      subtitle: 'List of all roles',
      link: 'list',
      canShow: this.roleManagementService.hasLink(UserManagementRelations.USERS_REL),
    },
    {
      icon: 'person_add',
      title: 'Create User',
      subtitle: 'Create a new User Account.',
      link: 'create',
      canShow: this.roleManagementService.isAllowedTo(UserManagementRelations.USER_CREATE_REL),
    },
  ];

  constructor(
    private readonly coreService: CoreService,
    private readonly roleManagementService: RoleManagementService,
  ) {}
}
