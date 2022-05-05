import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuData, UserManagementRelations } from '@app/ui/shared/domain';
import { TranslocoService } from '@ngneat/transloco';
import { UserManagementService } from '../../../../services/user-management.service';

@Component({
  selector: 'app-user-management-home',
  templateUrl: './user-management-home.component.html',
  styleUrls: ['./user-management-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementHomeComponent {
  private readonly TRANSLOCO_SCOPE = 'administration.user-management.home.tiles';
  public readonly tiles: MenuData[] = [
    {
      icon: 'contacts',
      title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.table.title`),
      subtitle$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.table.subtitle`),
      route: 'users',
      visible$: this.userManagementService.hasLink(UserManagementRelations.USERS_REL),
    },
    {
      icon: 'person_add',
      title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.detail.title`),
      subtitle$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.detail.subtitle`),
      route: 'create',
      visible$: this.userManagementService.hasTemplate(UserManagementRelations.USER_CREATE_REL),
    },
  ];

  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly translocoService: TranslocoService,
  ) {}
}
