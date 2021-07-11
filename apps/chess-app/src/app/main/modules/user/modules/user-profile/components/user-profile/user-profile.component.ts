import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chess-lite-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {}
