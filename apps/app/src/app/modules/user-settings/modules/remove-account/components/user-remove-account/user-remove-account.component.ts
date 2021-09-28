import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { CardViewHeaderService } from '../../../../../../core/modules/card-view/services/card-view-header.service';
import { ToasterService } from '../../../../../../core/services/toaster.service';
import { UserSettingsService } from '../../../../services/user-settings.service';
import { UserRemoveAccountConfirmComponent } from '../user-remove-account-confirm/user-remove-account-confirm.component';

@Component({
  selector: 'app-user-remove-account',
  templateUrl: './user-remove-account.component.html',
  styleUrls: ['./user-remove-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRemoveAccountComponent implements OnDestroy {
  constructor(
    public readonly userSettingsService: UserSettingsService,
    private readonly headerService: CardViewHeaderService,
    private readonly toasterService: ToasterService,
    private readonly dialogService: MatDialog,
    private readonly router: Router,
  ) {
    this.headerService.setHeader({ title: 'Remove Account' });
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  openDialog(): void {
    const matDialogRef = this.dialogService.open(UserRemoveAccountConfirmComponent, {
      width: '350px',
    });
    matDialogRef
      .afterClosed()
      .pipe(
        first(),
        switchMap(() => this.userSettingsService.deleteAccount()),
      )
      .subscribe({
        next: () => {
          this.toasterService.showToast({ title: 'Account and all associated data were removed.' });
          this.router.navigate(['auth', 'signup']);
        },
        error: () =>
          this.toasterService.showErrorToast({ title: 'An Error Occurred', message: 'Account was not removed.' }),
      });
  }
}
