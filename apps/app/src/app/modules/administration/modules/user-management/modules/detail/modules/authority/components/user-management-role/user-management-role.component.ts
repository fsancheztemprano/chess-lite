import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from '@app/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToasterService } from '../../../../../../../../../../shared/services/toaster.service';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

@UntilDestroy()
@Component({
  selector: 'app-user-management-role',
  templateUrl: './user-management-role.component.html',
  styleUrls: ['./user-management-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementRoleComponent implements OnInit {
  roles: Observable<Role[]> = this.route.data.pipe(
    startWith({ roles: [] }),
    map((data) => data.roles),
  );

  public form = new FormGroup({ id: new FormControl('') });

  constructor(
    public readonly userManagementDetailService: UserManagementDetailService,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.userManagementDetailService
      .getUser()
      .pipe(untilDestroyed(this))
      .subscribe((user) => this.form.patchValue(user?.role || {}));
  }

  onSubmit() {
    this.userManagementDetailService.updateProfile({ roleId: this.form.value.id }).subscribe({
      next: () => this.toasterService.showToast({ message: 'Role updated successfully' }),
      error: () => this.toasterService.showToast({ message: 'An error has occurred' }),
    });
  }
}
