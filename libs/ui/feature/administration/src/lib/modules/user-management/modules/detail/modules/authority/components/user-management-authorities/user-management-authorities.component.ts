import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { Authority } from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { startWith } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

@UntilDestroy()
@Component({
  selector: 'app-user-management-authorities',
  templateUrl: './user-management-authorities.component.html',
  styleUrls: ['./user-management-authorities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAuthoritiesComponent implements OnInit {
  public readonly formArray = new FormArray([]);
  public readonly TRANSLOCO_SCOPE = 'administration.user-management.detail.authority.authorities';

  constructor(
    public readonly userManagementDetailService: UserManagementDetailService,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
  ) {
    this._getAuthorities();
  }

  ngOnInit(): void {
    this.userManagementDetailService.user$.pipe(untilDestroyed(this)).subscribe((user) =>
      this.formArray.controls.forEach((control) => {
        const hasAuthority = user?.authorities?.some((authority) => authority.id === control.value.id);
        if (control.value.active != hasAuthority) {
          control.patchValue({ active: hasAuthority });
        }
      }),
    );
  }

  onSubmit() {
    this.userManagementDetailService
      .updateUserAuthorities(
        this.formArray.value
          .filter((authority: { active: boolean }) => authority.active)
          .map((authority: { id: string }) => authority.id),
      )
      .subscribe(() => this.toasterService.showToast({ message: translate(`${this.TRANSLOCO_SCOPE}.toast.saved`) }));
  }

  private _getAuthorities() {
    this.route.data
      .pipe(
        first(),
        startWith({ authorities: [] }),
        map((data) => data.authorities),
      )
      .subscribe((authorities: Authority[]) => {
        this.formArray.clear();
        authorities.forEach((authority) => {
          this.formArray.push(
            new FormGroup({
              id: new FormControl(authority.id),
              name: new FormControl(authority.name),
              active: new FormControl(false),
            }),
          );
        });
      });
  }
}
