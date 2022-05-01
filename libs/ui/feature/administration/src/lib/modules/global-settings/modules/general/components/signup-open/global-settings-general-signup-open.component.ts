import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToasterService } from '@app/ui/shared/app';
import { translate } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalSettingsService } from '../../../../services/global-settings.service';

@Component({
  selector: 'app-global-settings-general-signup-open',
  templateUrl: './global-settings-general-signup-open.component.html',
  styleUrls: ['./global-settings-general-signup-open.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsGeneralSignupOpenComponent {
  public readonly signupOpen$?: Observable<boolean | undefined> = this.globalSettingsService.globalSettings$.pipe(
    map((globalSettings) => globalSettings.signupOpen),
  );

  public readonly TRANSLOCO_SCOPE = 'administration.global-settings.general.signup-open';

  constructor(
    public readonly globalSettingsService: GlobalSettingsService,
    private readonly toasterService: ToasterService,
  ) {}

  public onToggle($event: { checked: boolean }): void {
    this.globalSettingsService.updateGlobalSettings({ signupOpen: $event.checked }).subscribe({
      next: () => this.toasterService.showToast({ message: translate(`${this.TRANSLOCO_SCOPE}.toast`) }),
    });
  }
}
