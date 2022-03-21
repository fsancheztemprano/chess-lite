import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-management-account',
  templateUrl: './user-management-account.component.html',
  styleUrls: ['./user-management-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAccountComponent {}
