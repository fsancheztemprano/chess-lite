import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UserManagementRelations } from '@app/domain';
import { noop } from 'rxjs';
import { ToasterService } from '../../../../../../../../../../shared/services/toaster.service';
import { matchingControlsValidators } from '../../../../../../../../../../shared/utils/forms/validators/matching-controls.validator';

@Component({
  selector: 'app-user-management-account-password',
  templateUrl: './user-management-account-password.component.html',
  styleUrls: ['./user-management-account-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAccountPasswordComponent {
  public user: User | undefined;

  public form = new FormGroup(
    {
      password: new FormControl(''),
      password2: new FormControl(''),
    },
    [matchingControlsValidators('password', 'password2')],
  );

  constructor(private readonly route: ActivatedRoute, private readonly toasterService: ToasterService) {
    this.route.parent?.parent?.data.subscribe((data) => {
      this.user = data.user;
    });
  }

  onSubmit() {
    this.user?.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_REL, this.form.value).subscribe({
      next: () => {
        this.toasterService.showToast({ message: 'Password updated successfully' });
        this.form.reset();
      },
      error: () => noop,
    });
  }
}
