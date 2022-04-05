import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/ui/shared/app';
import { Role, RoleChangedMessage, RoleManagementRelations, RolePage, WEBSOCKET_REL } from '@app/ui/shared/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { concat, EMPTY, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RoleManagementService } from '../../../../../role-management/services/role-management.service';

@UntilDestroy()
@Component({
  selector: 'app-global-settings-access-restrictions',
  templateUrl: './global-settings-access-restrictions.component.html',
  styleUrls: ['./global-settings-access-restrictions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsAccessRestrictionsComponent {
  roles$ = this.route.parent?.parent?.data.pipe(
    map((data) => data.roles),
    switchMap((rolePage: RolePage) =>
      concat(
        of(rolePage),
        rolePage.hasLink(WEBSOCKET_REL)
          ? this.messageService.subscribeToMessages<RoleChangedMessage>(rolePage.getLink(WEBSOCKET_REL)!.href).pipe(
              untilDestroyed(this),
              switchMap(() => this.roleManagementService.fetchRoles({ size: 1000 })),
            )
          : EMPTY,
      ),
    ),
    map((rolePage: RolePage) =>
      rolePage.getEmbeddedCollection(RoleManagementRelations.ROLE_MODEL_LIST_REL).map((role: Role) => of(role)),
    ),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly roleManagementService: RoleManagementService,
  ) {}
}
