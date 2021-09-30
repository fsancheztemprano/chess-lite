import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ThemeService } from '../../../../../../core/services/theme.service';
import { ToasterService } from '../../../../../../core/services/toaster.service';
import { TranslationService } from '../../../../../../core/services/translation.service';
import { filterNulls } from '../../../../../../shared/utils/forms/rxjs/filter-null.rxjs.pipe';
import { patchFormPipe } from '../../../../../../shared/utils/forms/rxjs/patch-form.rxjs.pipe';
import { UserSettingsService } from '../../../../services/user-settings.service';

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
    readonly userSettingsService: UserSettingsService,
    public readonly translationService: TranslationService,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
    private readonly themeService: ThemeService,
  ) {
    this.userSettingsService
      .getCurrentUserPreferences()
      .pipe(untilDestroyed(this), filterNulls(), patchFormPipe(this.form))
      .subscribe();
  }

  onSubmit() {
    this.userSettingsService.updateUserPreferences(this.form.value).subscribe({
      next: (userPreferences) => {
        this.themeService.setDarkMode(!!userPreferences.darkMode);
        this.translationService.setActiveLanguage(userPreferences.contentLanguage);
        this.toasterService.showToast({ message: 'User Preferences Saved Successfully' });
      },
      error: () => this.toasterService.showToast({ message: 'An Error Occurred' }),
    });
  }
}
