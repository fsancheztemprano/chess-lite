import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UserManagementRelations } from '@chess-lite/domain';
import { noop } from 'rxjs';
import { ToasterService } from '../../../../../../../../../../shared/services/toaster.service';
import { setTemplateValidators } from '../../../../../../../../../../shared/utils/forms/validators/set-template.validators';

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

  constructor(private readonly route: ActivatedRoute, private readonly toasterService: ToasterService) {
    this.route.parent?.parent?.data.subscribe((data) => {
      this.user = data.user;
      setTemplateValidators(this.form, data.user.getTemplate(UserManagementRelations.USER_UPDATE_REL));
      this.form.patchValue(data.user);
    });
  }

  onSubmit() {
    this.user?.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_REL, this.form.value).subscribe({
      next: () => this.toasterService.showToast({ message: 'User Profile Updated Successfully' }),
      error: () => noop,
    });
  }
}
