import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { UserSettingsService } from '@app/ui/shared/core';
import { filterNil } from '@ngneat/elf';
import { translate } from '@ngneat/transloco';
import { first, switchMap } from 'rxjs/operators';
import { UserRemoveAccountConfirmComponent } from '../user-remove-account-confirm/user-remove-account-confirm.component';

@Component({
  selector: 'app-user-remove-account',
  templateUrl: './user-remove-account.component.html',
  styleUrls: ['./user-remove-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRemoveAccountComponent {
  public readonly TRANSLOCO_SCOPE = 'user.remove-account';

  constructor(
    public readonly userSettingsService: UserSettingsService,
    private readonly toasterService: ToasterService,
    private readonly dialogService: MatDialog,
    private readonly router: Router,
  ) {}

  openDialog(): void {
    this.dialogService
      .open(UserRemoveAccountConfirmComponent, {
        width: '350px',
      })
      .afterClosed()
      .pipe(
        first(),
        filterNil(),
        switchMap(() => this.userSettingsService.deleteAccount()),
      )
      .subscribe({
        next: () => {
          this.toasterService.showToast({ title: translate(`${this.TRANSLOCO_SCOPE}.toast.success`) });
          this.router.navigate(['auth', 'signup']);
        },
        error: () => this.toasterService.showErrorToast({ title: translate(`${this.TRANSLOCO_SCOPE}.toast.error`) }),
      });
  }
}
