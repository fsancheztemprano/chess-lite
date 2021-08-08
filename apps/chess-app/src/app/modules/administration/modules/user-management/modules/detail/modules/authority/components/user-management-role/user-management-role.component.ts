import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role, User, UserManagementRelations } from '@chess-lite/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, startWith } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'chess-lite-user-management-role',
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

  submitSuccessMessage = false;
  submitErrorMessage = false;

  constructor(private readonly route: ActivatedRoute, private readonly cdr: ChangeDetectorRef) {}

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
          this.setSubmitStatus(true);
        },
        error: () => this.setSubmitStatus(false),
      });
  }

  setSubmitStatus(success: boolean) {
    this.submitSuccessMessage = success;
    this.submitErrorMessage = !success;
    this.cdr.markForCheck();
  }
}
