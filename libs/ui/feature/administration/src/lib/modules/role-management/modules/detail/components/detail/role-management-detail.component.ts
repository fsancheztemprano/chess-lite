import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ToasterService } from '@app/ui/shared/app';
import { CardViewHeaderService } from '@app/ui/shared/core';
import { Role, RoleChangedMessage, RoleChangedMessageAction, WEBSOCKET_REL } from '@app/ui/shared/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { RoleManagementService } from '../../../../services/role-management.service';

@UntilDestroy()
@Component({
  selector: 'app-role-management-detail',
  templateUrl: './role-management-detail.component.html',
  styleUrls: ['./role-management-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleManagementDetailComponent implements OnDestroy {
  private _role = new BehaviorSubject<Role>(this.route.snapshot.data.role);

  constructor(
    private readonly headerService: CardViewHeaderService,
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly roleManagementService: RoleManagementService,
    private readonly toasterService: ToasterService,
    private readonly router: Router,
  ) {
    this.headerService.setHeader({
      title: 'Edit Role',
      navigationLink: ['administration', 'role-management'],
    });
    this._subscribeToRoleChanges(this.route.snapshot.data.role);
  }

  get role(): Observable<Role> {
    return this._role.asObservable();
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  private _subscribeToRoleChanges(role: Role) {
    if (role.hasLink(WEBSOCKET_REL)) {
      this.messageService
        .subscribeToMessages<RoleChangedMessage>(role.getLink(WEBSOCKET_REL)!.href)
        .pipe(
          untilDestroyed(this),
          switchMap((roleChangedEvent) => {
            if (roleChangedEvent.action === RoleChangedMessageAction.UPDATED) {
              return this.roleManagementService
                .fetchOneRole(roleChangedEvent.roleId)
                .pipe(tap((updatedRole) => this._role.next(updatedRole)));
            } else {
              this.toasterService.showToast({ title: `Role ${roleChangedEvent.roleId} was removed.` });
              this.router.navigate(['administration', 'role-management']);
              return EMPTY;
            }
          }),
        )
        .subscribe();
    }
  }
}
