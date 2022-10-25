import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToasterService } from '@app/ui/shared/app';
import { translate } from '@ngneat/transloco';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

@Component({
  selector: 'app-user-management-account-token',
  templateUrl: './user-management-account-token.component.html',
  styleUrls: ['./user-management-account-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAccountTokenComponent {
  public readonly TRANSLOCO_SCOPE = 'administration.user-management.detail.account.token';

  constructor(
    public readonly userManagementDetailService: UserManagementDetailService,
    private readonly toasterService: ToasterService,
  ) {}

  sendActivationToken() {
    this.userManagementDetailService
      .sendActivationToken()
      .subscribe(() => this.toasterService.showToast({ message: translate(`${this.TRANSLOCO_SCOPE}.toast.sent`) }));
  }
}
