import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

@Component({
  selector: 'app-user-management-account-delete-confirm',
  templateUrl: './user-management-account-delete-confirm.component.html',
  styleUrls: ['./user-management-account-delete-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAccountDeleteConfirmComponent {
  constructor(public readonly userManagementDetailService: UserManagementDetailService) {}
}
