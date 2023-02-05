import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatLegacySlideToggleChange as MatSlideToggleChange } from '@angular/material/legacy-slide-toggle';
import { Role } from '@app/ui/shared/domain';
import { Observable } from 'rxjs';
import { RoleManagementService } from '../../../../../../services/role-management.service';

@Component({
  selector: 'app-role-management-detail-can-login',
  templateUrl: './role-management-detail-can-login.component.html',
  styleUrls: ['./role-management-detail-can-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleManagementDetailCanLoginComponent {
  @Input() role$!: Observable<Role>;
  @Input() showRoleName = false;
  @Input() showCanLoginLabel = false;

  constructor(private readonly roleManagementService: RoleManagementService) {}

  onToggle(role: Role, $event: MatSlideToggleChange) {
    this.roleManagementService.updateRole(role, { canLogin: $event.checked }).subscribe();
  }
}
