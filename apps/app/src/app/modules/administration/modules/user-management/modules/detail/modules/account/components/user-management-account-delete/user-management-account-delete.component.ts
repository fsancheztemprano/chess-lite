import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/domain';
import { EMPTY } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { UserManagementAccountDeleteConfirmComponent } from '../user-management-account-delete-confirm/user-management-account-delete-confirm.component';

@Component({
  selector: 'app-user-management-account-delete',
  templateUrl: './user-management-account-delete.component.html',
  styleUrls: ['./user-management-account-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAccountDeleteComponent {
  public user!: User;

  constructor(
    private readonly dialogService: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.route.parent?.parent?.data.subscribe((data) => {
      this.user = data.user;
    });
  }

  openDialog(): void {
    if (this.user?.username?.length) {
      const matDialogRef = this.dialogService.open(UserManagementAccountDeleteConfirmComponent, {
        data: { username: this.user.username },
        width: '350px',
      });
      matDialogRef
        .afterClosed()
        .pipe(
          first(),
          switchMap((username) =>
            !!username?.length && this.user ? this.user.submitToTemplateOrThrow('delete') : EMPTY,
          ),
        )
        .subscribe({
          next: () => this.router.navigate(['administration', 'user-management']),
        });
    }
  }
}
