import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { Role, RoleManagementRelations, RolePage } from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalSettingsService } from '../../../../services/global-settings.service';

@UntilDestroy()
@Component({
  selector: 'app-global-settings-general-default-role',
  templateUrl: './global-settings-general-default-role.component.html',
  styleUrls: ['./global-settings-general-default-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsGeneralDefaultRoleComponent {
  public readonly roles?: Observable<Role[]> = this.route.parent?.parent?.data.pipe(
    map((data) => data.roles),
    map((rolePage: RolePage) => rolePage.getEmbeddedCollection<Role>(RoleManagementRelations.ROLE_MODEL_LIST_REL)),
    startWith([]),
  );

  public readonly form = new FormGroup({ defaultRoleId: new FormControl('') });
  public readonly TRANSLOCO_SCOPE = 'administration.global-settings.general.default-role';

  constructor(
    public readonly globalSettingsService: GlobalSettingsService,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
  ) {
    this.globalSettingsService.globalSettings$
      .pipe(untilDestroyed(this))
      .subscribe((globalSettings) => this.form.patchValue({ defaultRoleId: globalSettings.defaultRole?.id }));
  }

  public onSubmit(): void {
    this.globalSettingsService.updateGlobalSettings(this.form.value).subscribe({
      next: () => this.toasterService.showToast({ message: translate(`${this.TRANSLOCO_SCOPE}.toast`) }),
    });
  }
}
