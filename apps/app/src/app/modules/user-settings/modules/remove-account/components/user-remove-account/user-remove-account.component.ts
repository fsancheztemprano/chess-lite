import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CurrentUserRelations, User } from '@app/domain';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { HeaderService } from '../../../../../../core/services/header.service';
import { CurrentUserService } from '../../../../services/current-user.service';
import { UserRemoveAccountConfirmComponent } from '../user-remove-account-confirm/user-remove-account-confirm.component';

@UntilDestroy()
@Component({
  selector: 'app-user-remove-account',
  templateUrl: './user-remove-account.component.html',
  styleUrls: ['./user-remove-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRemoveAccountComponent implements OnDestroy {
  private readonly _user$: Observable<User> = this.userService.getCurrentUser() as Observable<User>;

  DELETE_ACCOUNT_REL = CurrentUserRelations.DELETE_ACCOUNT_REL;

  constructor(
    private readonly dialogService: MatDialog,
    public readonly userService: CurrentUserService,
    private readonly headerService: HeaderService,
    private readonly router: Router,
  ) {
    this.headerService.setHeader({ title: 'Remove Account' });
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  get user$(): Observable<User> {
    return this._user$;
  }

  openDialog(): void {
    const matDialogRef = this.dialogService.open(UserRemoveAccountConfirmComponent, {
      width: '350px',
    });
    matDialogRef
      .afterClosed()
      .pipe(
        first(),
        switchMap(() => this.userService.deleteAccount(this.user$)),
      )
      .subscribe(() => this.router.navigate(['auth', 'signup']));
  }
}
