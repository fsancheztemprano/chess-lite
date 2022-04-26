import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CoreService } from '@app/ui/shared/core';
import { MenuData, UserManagementRelations } from '@app/ui/shared/domain';
import { UserManagementService } from '../../../../services/user-management.service';

@Component({
  selector: 'app-user-management-home',
  templateUrl: './user-management-home.component.html',
  styleUrls: ['./user-management-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementHomeComponent implements OnDestroy {
  tiles: MenuData[] = [
    {
      icon: 'contacts',
      title: 'User List',
      subtitle: 'List of all users',
      route: 'users',
      canShow: this.userManagementService.hasLink(UserManagementRelations.USERS_REL),
    },
    {
      icon: 'person_add',
      title: 'Create User',
      subtitle: 'Create a new User Account.',
      route: 'create',
      canShow: this.userManagementService.hasTemplate(UserManagementRelations.USER_CREATE_REL),
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
