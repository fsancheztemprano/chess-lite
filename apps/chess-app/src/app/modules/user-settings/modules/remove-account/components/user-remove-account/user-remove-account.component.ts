import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@chess-lite/domain';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EMPTY, iif, Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { CurrentUserService } from '../../../../services/current-user.service';
import { UserRemoveAccountConfirmComponent } from '../user-remove-account-confirm/user-remove-account-confirm.component';

@UntilDestroy()
@Component({
  selector: 'chess-lite-user-remove-account',
  templateUrl: './user-remove-account.component.html',
  styleUrls: ['./user-remove-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRemoveAccountComponent {
  private readonly _user$: Observable<User> = this.userService.getCurrentUser() as Observable<User>;

  constructor(private readonly dialogService: MatDialog, public readonly userService: CurrentUserService) {}

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
        switchMap((username) => iif(() => !!username?.length, this.userService.deleteAccount(this.user$), EMPTY)),
      )
      .subscribe();
  }
}
