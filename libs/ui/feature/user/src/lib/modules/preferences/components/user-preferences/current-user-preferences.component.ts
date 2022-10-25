import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filterNulls } from '@app/ui/shared/app';
import { patchFormPipe } from '@app/ui/shared/common';
import { LocalizationRepository, UserSettingsService } from '@app/ui/shared/core';
import { IUserPreferences } from '@app/ui/shared/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-current-user-preferences',
  templateUrl: './current-user-preferences.component.html',
  styleUrls: ['./current-user-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentUserPreferencesComponent {
  public form = new FormGroup({
    darkMode: new FormControl(false),
    contentLanguage: new FormControl('en'),
  });

  constructor(
    public readonly userSettingsService: UserSettingsService,
    public readonly localizationRepository: LocalizationRepository,
  ) {
    this.userSettingsService
      .getCurrentUserPreferences()
      .pipe(untilDestroyed(this), filterNulls(), patchFormPipe(this.form))
      .subscribe();
  }

  onSubmit() {
    this.userSettingsService.updateUserPreferences(this.form.value as IUserPreferences).subscribe();
  }
}
