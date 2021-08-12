import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role, User, UserManagementRelations } from '@app/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { noop, Observable, startWith } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { ToasterService } from '../../../../../../../../../../shared/services/toaster.service';

@UntilDestroy()
@Component({
  selector: 'app-user-management-role',
  templateUrl: './user-management-role.component.html',
  styleUrls: ['./user-management-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementRoleComponent implements OnInit {
  @Input() user$: Observable<User> | undefined;

  @Output() userChange = new EventEmitter<User>();

  roles: Observable<Role[]> = this.route.data.pipe(
    startWith({ roles: [] }),
    map((data) => data.roles),
  );

  public form = new FormGroup({ id: new FormControl('') });

  constructor(private readonly route: ActivatedRoute, private readonly toasterService: ToasterService) {}

  ngOnInit(): void {
    this.user$?.pipe(untilDestroyed(this)).subscribe((user) => this.form.patchValue(user?.role || {}));
  }

  onSubmit() {
    this.user$
      ?.pipe(
        first(),
        switchMap((user) =>
          user.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_REL, { roleId: this.form.value.id }),
        ),
      )
      .subscribe({
        next: (user) => {
          this.userChange.emit(user);
          this.toasterService.showToast({ message: 'Role updated successfully' });
        },
        error: () => noop,
      });
  }
}
