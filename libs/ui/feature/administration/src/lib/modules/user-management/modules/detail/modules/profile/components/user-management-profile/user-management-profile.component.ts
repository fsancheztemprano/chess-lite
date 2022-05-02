import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToasterService } from '@app/ui/shared/app';
import { setTemplateValidators } from '@app/ui/shared/common';
import { UserManagementRelations } from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

@UntilDestroy()
@Component({
  selector: 'app-user-management-profile',
  templateUrl: './user-management-profile.component.html',
  styleUrls: ['./user-management-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementProfileComponent {
  public readonly TRANSLOCO_SCOPE = 'administration.user-management.detail.profile';
  public readonly form = new FormGroup({
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

  constructor(
    public readonly userManagementDetailService: UserManagementDetailService,
    private readonly toasterService: ToasterService,
  ) {
    this.userManagementDetailService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      setTemplateValidators(this.form, user.getTemplate(UserManagementRelations.USER_UPDATE_REL));
      this.form.patchValue(user);
    });
  }

  onSubmit(): void {
    this.userManagementDetailService
      .updateUser(this.form.value)
      .subscribe(() => this.toasterService.showToast({ message: translate(`${this.TRANSLOCO_SCOPE}.toast.updated`) }));
  }
}
