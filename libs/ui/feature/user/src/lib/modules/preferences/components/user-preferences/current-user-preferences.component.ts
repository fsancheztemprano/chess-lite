import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filterNulls, ToasterService } from '@app/ui/shared/app';
import { patchFormPipe } from '@app/ui/shared/common';
import { LocalizationRepository, UserSettingsService } from '@app/ui/shared/core';
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
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
  ) {
    this.userSettingsService
      .getCurrentUserPreferences()
      .pipe(untilDestroyed(this), filterNulls(), patchFormPipe(this.form))
      .subscribe();
  }

  onSubmit() {
    this.userSettingsService.updateUserPreferences(this.form.value).subscribe({
      error: () => this.toasterService.showErrorToast({ message: 'An Error Occurred' }),
    });
  }
}
