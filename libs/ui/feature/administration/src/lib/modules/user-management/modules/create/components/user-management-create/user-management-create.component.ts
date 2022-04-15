import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { matchingControlsValidators, setTemplateValidatorsPipe } from '@app/ui/shared/common';
import { CardViewHeaderService } from '@app/ui/shared/core';
import { Role, RoleManagementRelations, RolePage, UserManagementRelations } from '@app/ui/shared/domain';
import { noop, Observable, startWith } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { UserManagementService } from '../../../../services/user-management.service';

@Component({
  selector: 'app-user-management-create',
  templateUrl: './user-management-create.component.html',
  styleUrls: ['./user-management-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementCreateComponent implements OnDestroy {
  roles$: Observable<Role[]> = this.activatedRoute.data.pipe(
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

  constructor(
    public readonly userManagementService: UserManagementService,
    private readonly headerService: CardViewHeaderService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toaster: ToasterService,
  ) {
    this.headerService.setHeader({ title: 'New User' });
    this.userManagementService
      .getTemplate(UserManagementRelations.USER_CREATE_REL)
      .pipe(first(), setTemplateValidatorsPipe(this.form))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  onSubmit() {
    this.userManagementService.createUser(this.form.value).subscribe({
      next: (user) => {
        this.toaster.showToast({ message: 'User Created Successfully' });
        this.router.navigate(['administration', 'user-management', 'edit', user.id]);
      },
      error: () => noop,
    });
  }
}
