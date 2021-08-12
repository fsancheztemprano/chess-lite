import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-management-account-delete-confirm',
  templateUrl: './user-management-account-delete-confirm.component.html',
  styleUrls: ['./user-management-account-delete-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAccountDeleteConfirmComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { username: string }) {}
}
