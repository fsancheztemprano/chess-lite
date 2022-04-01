import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Authority, Role } from '@app/domain';
import { ToasterService } from '@app/ui/shared/app';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, startWith } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { RoleManagementService } from '../../../../services/role-management.service';

@UntilDestroy()
@Component({
  selector: 'app-role-management-detail-authorities',
  templateUrl: './role-management-detail-authorities.component.html',
  styleUrls: ['./role-management-detail-authorities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleManagementDetailAuthoritiesComponent implements OnInit {
  @Input() role$!: Observable<Role>;

  public form = new FormArray([]);

  constructor(
    private readonly roleManagementService: RoleManagementService,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
  ) {
    this._getAuthorities();
  }

  ngOnInit(): void {
    this.role$?.pipe(untilDestroyed(this)).subscribe((role) => {
      this.form.controls.forEach((control) => {
        const hasAuthority = role?.authorities?.some((authority) => authority.id === control.value.id);
        if (control.value.active != hasAuthority) {
          control.patchValue({ active: hasAuthority });
        }
      });
    });
  }

  onSubmit(role: Role) {
    this.roleManagementService
      .updateRole(role, {
        authorityIds: this.form.value
          .filter((authority: { active: boolean }) => authority.active)
          .map((authority: { id: string }) => authority.id),
      })
      .subscribe({
        next: () => this.toasterService.showToast({ message: 'Authorities updated successfully' }),
        error: () => this.toasterService.showErrorToast({ title: 'An Error occurred' }),
      });
  }

  private _getAuthorities() {
    this.route.data
      .pipe(
        first(),
        startWith({ authorities: [] }),
        map((data) => data.authorities),
      )
      .subscribe((authorities: Authority[]) => {
        this.form.clear();
        authorities.forEach((authority) => {
          this.form.push(
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
