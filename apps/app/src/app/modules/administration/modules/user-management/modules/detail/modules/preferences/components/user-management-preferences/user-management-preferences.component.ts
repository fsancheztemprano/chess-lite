import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserPreferences } from '@app/domain';
import { ToasterService } from '../../../../../../../../../../shared/services/toaster.service';
import { TranslationService } from '../../../../../../../../../../shared/services/translation.service';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

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
    public readonly userManagementDetailService: UserManagementDetailService,
    public readonly translationService: TranslationService,
    private readonly toasterService: ToasterService,
  ) {
    this.userManagementDetailService.getUserPreferences().subscribe((userPreferences: UserPreferences) => {
      this.userPreferences = userPreferences;
      this.form.patchValue(userPreferences);
    });
  }

  onSubmit() {
    this.userManagementDetailService.updateUserPreferences(this.userPreferences, this.form.value).subscribe({
      next: () => this.toasterService.showToast({ message: 'User Preferences Saved Successfully' }),
      error: () => this.toasterService.showErrorToast({ message: 'An Error has Occurred' }),
    });
  }
}
