import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Role, RoleChangedMessage, RolesListChangedMessageDestination } from '@app/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { concat, EMPTY, of, tap } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { MessageService } from '../../../../../../../../core/services/message.service';
import { ToasterService } from '../../../../../../../../core/services/toaster.service';
import { RoleManagementService } from '../../../../../role-management/services/role-management.service';

@UntilDestroy()
@Component({
  selector: 'app-global-settings-access-restrictions',
  templateUrl: './global-settings-access-restrictions.component.html',
  styleUrls: ['./global-settings-access-restrictions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsAccessRestrictionsComponent {
  roles$ = concat(
    this.route.parent?.parent?.data.pipe(
      first(),
      map((data) => data.roles),
    ) || EMPTY,
    this.messageService.subscribeToMessages<RoleChangedMessage>(new RolesListChangedMessageDestination()).pipe(
      untilDestroyed(this),
      switchMap(() => this.roleManagementService.fetchAllRoles()),
      tap({
        next: () => this.toasterService.showToast({ message: 'An update was received from the service.' }),
      }),
    ),
  ).pipe(map((roles) => roles.map((role: Role) => of(role))));

  constructor(
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly toasterService: ToasterService,
    private readonly roleManagementService: RoleManagementService,
  ) {}
}
