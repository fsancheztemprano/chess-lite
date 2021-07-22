import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chess-lite-user-management-detail',
  templateUrl: './user-management-detail.component.html',
  styleUrls: ['./user-management-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementDetailComponent {}
