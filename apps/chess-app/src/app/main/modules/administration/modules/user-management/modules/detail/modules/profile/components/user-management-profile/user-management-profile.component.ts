import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '@chess-lite/domain';
import { setTemplateValidators } from '../../../../../../../../../../../core/utils/forms/validators/set-template.validators';

@Component({
  selector: 'chess-lite-user-management-profile',
  templateUrl: './user-management-profile.component.html',
  styleUrls: ['./user-management-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementProfileComponent {
  public user: User | undefined;
  public form = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    profileImageUrl: new FormControl(''),
    active: new FormControl(false),
    locked: new FormControl(false),
    expired: new FormControl(false),
    credentialsExpired: new FormControl(false),
  });
  submitSuccessMessage = false;
  submitErrorMessage = false;

  constructor(private readonly route: ActivatedRoute, private readonly cdr: ChangeDetectorRef) {
    this.route.parent?.parent?.data.subscribe((data) => {
      this.user = data.user;
      setTemplateValidators(this.form, data.user.getTemplate('update'));
      this.form.patchValue(data.user);
    });
  }

  onSubmit() {
    this.user?.submitToTemplateOrThrow('update', this.form.value).subscribe({
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
