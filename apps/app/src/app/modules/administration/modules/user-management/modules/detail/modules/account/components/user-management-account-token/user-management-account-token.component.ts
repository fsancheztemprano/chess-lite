import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivationTokenRelations, User } from '@app/domain';
import { ToasterService } from '../../../../../../../../../../shared/services/toaster.service';

@Component({
  selector: 'app-user-management-account-token',
  templateUrl: './user-management-account-token.component.html',
  styleUrls: ['./user-management-account-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAccountTokenComponent {
  public user!: User;

  constructor(private readonly route: ActivatedRoute, private readonly toasterService: ToasterService) {
    this.route.parent?.parent?.data.subscribe((data) => {
      this.user = data.user;
    });
  }

  sendActivationToken() {
    this.user.submitToTemplateOrThrow(ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL).subscribe({
      next: () => this.toasterService.showToast({ message: 'Activation token sent.' }),
      error: () => this.toasterService.showErrorToast({ message: 'Error requesting activation' }),
    });
  }
}
