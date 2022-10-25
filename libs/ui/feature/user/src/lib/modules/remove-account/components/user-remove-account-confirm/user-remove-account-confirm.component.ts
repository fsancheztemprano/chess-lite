import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserSettingsService } from '@app/ui/shared/core';

@Component({
  selector: 'app-user-remove-account-confirm',
  templateUrl: './user-remove-account-confirm.component.html',
  styleUrls: ['./user-remove-account-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRemoveAccountConfirmComponent {
  constructor(public readonly userService: UserSettingsService) {}
}
