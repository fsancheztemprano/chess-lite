import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { matchingControlsValidators, setTemplateValidatorsPipe } from '@app/ui/shared/common';
import { CardViewHeaderService } from '@app/ui/shared/core';
import { Role, UserManagementRelations } from '@app/ui/shared/domain';
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
  roles: Observable<Role[]> = this.activatedRoute.data.pipe(
    startWith({ roles: [] }),
    map((data) => data.roles),
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

  private readonly routeUp = ['administration', 'user-management'];

  constructor(
    public readonly userManagementService: UserManagementService,
    private readonly headerService: CardViewHeaderService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toaster: ToasterService,
  ) {
    this.headerService.setHeader({ title: 'New User', navigationLink: this.routeUp });
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
        setTimeout(() => {
          this.router.navigate([...this.routeUp, 'edit', user.id]);
        }, 2000);
      },
      error: () => noop,
    });
  }
}
