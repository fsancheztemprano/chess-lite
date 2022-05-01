import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ToasterService } from '@app/ui/shared/app';
import { Role, RoleChangedMessage, RoleChangedMessageAction, WEBSOCKET_REL } from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { concat, EMPTY, Observable, of, ReplaySubject, share, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleManagementService } from '../../../../services/role-management.service';

@UntilDestroy()
@Component({
  selector: 'app-role-management-detail',
  templateUrl: './role-management-detail.component.html',
  styleUrls: ['./role-management-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleManagementDetailComponent {
  public readonly role$ = this.route.data.pipe(
    map((data) => data.role),
    switchMap((role) => concat(of(role), this._roleUpdates$(role))),
    share({ connector: () => new ReplaySubject(1) }),
  );

  public readonly TRANSLOCO_SCOPE = 'administration.role-management.detail';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly roleManagementService: RoleManagementService,
    private readonly toasterService: ToasterService,
    private readonly router: Router,
  ) {}

  private _roleUpdates$(role: Role): Observable<Role> {
    return role.hasLink(WEBSOCKET_REL)
      ? this.messageService.multicast<RoleChangedMessage>(role.getLinkOrThrow(WEBSOCKET_REL).href).pipe(
          untilDestroyed(this),
          switchMap((roleChangedEvent) => {
            if (roleChangedEvent.action === RoleChangedMessageAction.UPDATED) {
              return this.roleManagementService.fetchOneRole(roleChangedEvent.roleId);
            } else {
              this.toasterService.showToast({
                title: translate(`${this.TRANSLOCO_SCOPE}.toast.deleted`, { roleId: roleChangedEvent.roleId }),
              });
              this.router.navigate(['administration', 'role-management']);
              return EMPTY;
            }
          }),
        )
      : EMPTY;
  }
}
