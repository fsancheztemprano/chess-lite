import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'chess-lite-user-management-create',
  templateUrl: './user-management-create.component.html',
  styleUrls: ['./user-management-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementCreateComponent {
  public form = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    profileImageUrl: new FormControl(''),
    role: new FormControl(''),
    active: new FormControl(false),
    locked: new FormControl(false),
    expired: new FormControl(false),
    credentialsExpired: new FormControl(false),
  });

  submitError = false;
  submitSuccess = false;
  submitSuccessMessage = false;
  submitErrorMessage = false;

  onSubmit() {
    // noop
  }
}
