import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserRelations, UserPreferences } from '@app/domain';
import { noop } from 'rxjs';
import { ThemeService } from '../../../../../../core/services/theme.service';
import { ToasterService } from '../../../../../../core/services/toaster.service';
import { TranslationService } from '../../../../../../core/services/translation.service';
import { setTemplateValidators } from '../../../../../../shared/utils/forms/validators/set-template.validators';
import { CurrentUserPreferencesService } from '../../services/current-user-preferences.service';

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
  private userPreferences!: UserPreferences;

  constructor(
    private readonly userPreferencesService: CurrentUserPreferencesService,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
    private readonly themeService: ThemeService,
    public readonly translationService: TranslationService,
  ) {
    this.route.data.subscribe((data) => {
      this.userPreferences = data.userPreferences;
      setTemplateValidators(this.form, this.userPreferences.getTemplate(CurrentUserRelations.UPDATE_PREFERENCES_REL));
      this.form.patchValue(this.userPreferences);
    });
  }

  onSubmit() {
    this.userPreferencesService.updateCurrentUserPreferences(this.userPreferences, this.form.value).subscribe({
      next: (userPreferences) => {
        this.themeService.setDarkMode(!!userPreferences.darkMode);
        this.translationService.setActiveLanguage(userPreferences.contentLanguage);
        this.toasterService.showToast({ message: 'User Preferences Saved Successfully' });
      },
      error: () => noop,
    });
  }
}
