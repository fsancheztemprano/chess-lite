import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  UserManagementRelations,
  UserPreferences,
  UserPreferencesChangedMessage,
  UserPreferencesChangedMessageDestination,
} from '@app/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs/operators';
import { MessageService } from '../../../../../../../../../../core/services/message.service';
import { ToasterService } from '../../../../../../../../../../core/services/toaster.service';
import { TranslationService } from '../../../../../../../../../../core/services/translation.service';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

@UntilDestroy()
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
    private readonly messageService: MessageService,
  ) {
    this.userManagementDetailService.fetchUserPreferences().subscribe((userPreferences: UserPreferences) => {
      this._setUserPreferences(userPreferences);
      this._subscribeToUserPreferencesChanges(userPreferences.id || '');
    });
  }

  onSubmit() {
    this.userManagementDetailService.updateUserPreferences(this.userPreferences, this.form.value).subscribe({
      next: () => this.toasterService.showToast({ message: 'User Preferences Saved Successfully' }),
      error: () => this.toasterService.showErrorToast({ message: 'An Error has Occurred' }),
    });
  }

  private _setUserPreferences(userPreferences: UserPreferences) {
    this.userPreferences = userPreferences;
    this.form.patchValue(userPreferences);
  }

  private _subscribeToUserPreferencesChanges(userPreferencesId: string) {
    this.messageService
      .subscribeToMessages<UserPreferencesChangedMessage>(
        new UserPreferencesChangedMessageDestination(userPreferencesId),
      )
      .pipe(
        untilDestroyed(this),
        switchMap(() => this.userManagementDetailService.fetchUserPreferences()),
      )
      .subscribe((userPreferences) => this._setUserPreferences(userPreferences));
  }

  isAllowedToUpdateUserPreferences() {
    return !!this.userPreferences?.isAllowedTo(UserManagementRelations.USER_UPDATE_REL);
  }
}
