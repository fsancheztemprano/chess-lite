import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UserManagementRelations } from '@chess-lite/domain';
import { matchingControlsValidators } from '../../../../../../../../../../shared/utils/forms/validators/matching-controls.validator';

@Component({
  selector: 'chess-lite-user-management-account-password',
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
  submitSuccessMessage = false;
  submitErrorMessage = false;

  constructor(private readonly route: ActivatedRoute, private readonly cdr: ChangeDetectorRef) {
    this.route.parent?.parent?.data.subscribe((data) => {
      this.user = data.user;
    });
  }

  onSubmit() {
    this.user?.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_REL, this.form.value).subscribe({
      next: () => this.setSubmitStatus(true),
      error: () => this.setSubmitStatus(false),
    });
  }

  setSubmitStatus(success: boolean) {
    this.submitSuccessMessage = success;
    this.submitErrorMessage = !success;
    this.cdr.markForCheck();
  }
}
