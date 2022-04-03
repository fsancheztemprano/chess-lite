import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CoreService, TiledMenuTileData } from '@app/ui/shared/core';
import { UserManagementRelations } from '@app/ui/shared/domain';
import { UserManagementService } from '../../../../services/user-management.service';

@Component({
  selector: 'app-user-management-home',
  templateUrl: './user-management-home.component.html',
  styleUrls: ['./user-management-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementHomeComponent implements OnDestroy {
  tiles: TiledMenuTileData[] = [
    {
      icon: 'contacts',
      title: 'User List',
      subtitle: 'List of all users',
      link: 'list',
      canShow: this.userManagementService.hasLink(UserManagementRelations.USERS_REL),
    },
    {
      icon: 'person_add',
      title: 'Create User',
      subtitle: 'Create a new User Account.',
      link: 'create',
      canShow: this.userManagementService.isAllowedTo(UserManagementRelations.USER_CREATE_REL),
    },
  ];

  constructor(
    private readonly coreService: CoreService,
    private readonly userManagementService: UserManagementService,
  ) {
    this.coreService.setCoreStyle('raw');
  }

  ngOnDestroy(): void {
    this.coreService.reset();
  }
}
