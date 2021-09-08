import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserRelations, UserPreferences } from '@app/domain';
import { noop } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToasterService } from '../../../../../../../../../../shared/services/toaster.service';
import { TranslationService } from '../../../../../../../../../../shared/services/translation.service';
import { setTemplateValidators } from '../../../../../../../../../../shared/utils/forms/validators/set-template.validators';
import { UserPreferencesService } from '../../services/user-preferences.service';

@Component({
  selector: 'app-user-management-preferences',
  templateUrl: './user-management-preferences.component.html',
  styleUrls: ['./user-management-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementPreferencesComponent {
  public form = new FormGroup({
    darkMode: new FormControl(false),
    contentLanguage: new FormControl('en'),
  });
  private userPreferences!: UserPreferences;

  constructor(
    private readonly userPreferencesService: UserPreferencesService,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
    public readonly translationService: TranslationService,
  ) {
    this.route.parent?.parent?.data
      .pipe(switchMap((data) => this.userPreferencesService.getUserPreferences(data.user)))
      .subscribe((userPreferences: UserPreferences) => {
        this.userPreferences = userPreferences;
        setTemplateValidators(this.form, this.userPreferences.getTemplate(CurrentUserRelations.UPDATE_PREFERENCES_REL));
        this.form.patchValue(this.userPreferences);
      });
  }

  onSubmit() {
    this.userPreferencesService.updateUserPreferences(this.userPreferences, this.form.value).subscribe({
      next: () => this.toasterService.showToast({ message: 'User Preferences Saved Successfully' }),
      error: () => noop,
    });
  }
}
