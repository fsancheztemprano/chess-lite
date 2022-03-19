import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared';
import { filter } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';
import { UserManagementAccountDeleteConfirmComponent } from '../user-management-account-delete-confirm/user-management-account-delete-confirm.component';

@Component({
  selector: 'app-user-management-account-delete',
  templateUrl: './user-management-account-delete.component.html',
  styleUrls: ['./user-management-account-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAccountDeleteComponent {
  constructor(
    public readonly userManagementDetailService: UserManagementDetailService,
    private readonly dialogService: MatDialog,
    private readonly router: Router,
    private readonly toasterService: ToasterService,
  ) {}

  openDialog(): void {
    const matDialogRef = this.dialogService.open(UserManagementAccountDeleteConfirmComponent, {
      width: '350px',
    });
    matDialogRef
      .afterClosed()
      .pipe(
        first(),
        filter((username) => !!username?.length),
        switchMap(() => this.userManagementDetailService.deleteUser()),
      )
      .subscribe({
        next: () => {
          this.toasterService.showToast({ message: 'Account Removed Successfully' });
          this.router.navigate(['administration', 'user-management']);
        },
        error: () => this.toasterService.showToast({ message: 'An Error has occurred' }),
      });
  }
}
