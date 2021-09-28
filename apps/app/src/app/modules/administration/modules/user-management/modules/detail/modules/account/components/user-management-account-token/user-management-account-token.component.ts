import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToasterService } from '../../../../../../../../../../core/services/toaster.service';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

@Component({
  selector: 'app-user-management-account-token',
  templateUrl: './user-management-account-token.component.html',
  styleUrls: ['./user-management-account-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAccountTokenComponent {
  constructor(
    public readonly userManagementDetailService: UserManagementDetailService,
    readonly toasterService: ToasterService,
  ) {}

  sendActivationToken() {
    this.userManagementDetailService.sendActivationToken().subscribe({
      next: () => this.toasterService.showToast({ message: 'Activation token sent.' }),
      error: () => this.toasterService.showErrorToast({ message: 'Error requesting activation' }),
    });
  }
}
