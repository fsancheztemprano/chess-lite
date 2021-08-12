import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-management-home',
  templateUrl: './user-management-home.component.html',
  styleUrls: ['./user-management-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementHomeComponent {}
