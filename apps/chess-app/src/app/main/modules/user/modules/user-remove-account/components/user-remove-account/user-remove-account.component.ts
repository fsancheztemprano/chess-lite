import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Resource } from '@chess-lite/hal-form-client';
import { EMPTY, iif, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from '../../../../services/user.service';
import { UserRemoveAccountConfirmComponent } from '../user-remove-account-confirm/user-remove-account-confirm.component';

@Component({
  selector: 'chess-lite-user-remove-account',
  templateUrl: './user-remove-account.component.html',
  styleUrls: ['./user-remove-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRemoveAccountComponent {
  private readonly _user$: Observable<Resource> = this.route.data.pipe(map(({ user }) => user));

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dialogService: MatDialog,
    public readonly userService: UserService,
  ) {}

  get user$(): Observable<Resource> {
    return this._user$;
  }

  openDialog(): void {
    const matDialogRef = this.dialogService.open(UserRemoveAccountConfirmComponent, {
      width: '350px',
    });
    matDialogRef
      .afterClosed()
      .pipe(switchMap((username) => iif(() => !!username?.length, this.userService.deleteAccount(this.user$), EMPTY)))
      .subscribe();
  }
}
