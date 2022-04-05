import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { Role } from '@app/ui/shared/domain';
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
  roles?: Observable<Role[]> = this.route.parent?.parent?.data.pipe(
    map((data) => data.roles),
    startWith([]),
  );

  public form = new FormGroup({ defaultRoleId: new FormControl('') });

  constructor(
    public readonly globalSettingsService: GlobalSettingsService,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
  ) {
    this.globalSettingsService.globalSettings$
      .pipe(untilDestroyed(this))
      .subscribe((globalSettings) => this.form.patchValue({ defaultRoleId: globalSettings.defaultRole?.id }));
  }

  onSubmit() {
    this.globalSettingsService.updateGlobalSettings(this.form.value).subscribe({
      next: () => this.toasterService.showToast({ message: 'Global Settings Saved Successfully' }),
      error: () => this.toasterService.showErrorToast({ message: 'An Error has Occurred' }),
    });
  }
}
