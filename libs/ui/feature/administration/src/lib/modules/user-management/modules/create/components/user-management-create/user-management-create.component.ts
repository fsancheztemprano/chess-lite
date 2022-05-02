import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { matchingControlsValidators, setTemplateValidatorsPipe } from '@app/ui/shared/common';
import { Role, RoleManagementRelations, RolePage, UserManagementRelations } from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { Observable, startWith } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { UserManagementService } from '../../../../services/user-management.service';

@Component({
  selector: 'app-user-management-create',
  templateUrl: './user-management-create.component.html',
  styleUrls: ['./user-management-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementCreateComponent {
  public readonly roles$: Observable<Role[]> = this.activatedRoute.data.pipe(
    map((data) => data.roles),
    map((rolePage: RolePage) => rolePage.getEmbeddedCollection<Role>(RoleManagementRelations.ROLE_MODEL_LIST_REL)),
    startWith([]),
  );

  public form = new FormGroup(
    {
      username: new FormControl(''),
      email: new FormControl(''),
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      profileImageUrl: new FormControl(''),
      roleId: new FormControl(''),
      password: new FormControl(''),
      password2: new FormControl(''),
      active: new FormControl(false),
      locked: new FormControl(false),
      expired: new FormControl(false),
      credentialsExpired: new FormControl(false),
    },
    [matchingControlsValidators('password', 'password2')],
  );
  public readonly TRANSLOCO_SCOPE = 'administration.user-management.create';

  constructor(
    public readonly userManagementService: UserManagementService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toaster: ToasterService,
  ) {
    this.userManagementService
      .getTemplate(UserManagementRelations.USER_CREATE_REL)
      .pipe(first(), setTemplateValidatorsPipe(this.form))
      .subscribe();
  }

  onSubmit() {
    this.userManagementService.createUser(this.form.value).subscribe((user) => {
      this.toaster.showToast({ message: translate(`${this.TRANSLOCO_SCOPE}.toast.created`) });
      this.router.navigate(['administration', 'user-management', 'user', user.id]);
    });
  }
}
