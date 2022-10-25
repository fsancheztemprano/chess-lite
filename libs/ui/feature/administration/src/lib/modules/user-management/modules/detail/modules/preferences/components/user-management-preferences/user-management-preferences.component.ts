import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService, ToasterService } from '@app/ui/shared/app';
import { LocalizationRepository } from '@app/ui/shared/core';
import {
  IUserPreferences,
  UserManagementRelations,
  UserPreferences,
  UserPreferencesChangedMessage,
  WEBSOCKET_REL,
} from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs/operators';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

@UntilDestroy()
@Component({
  selector: 'app-user-management-preferences',
  templateUrl: './user-management-preferences.component.html',
  styleUrls: ['./user-management-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementPreferencesComponent {
  public readonly TRANSLOCO_SCOPE = 'administration.user-management.detail.preferences';
  public readonly form = new FormGroup({
    darkMode: new FormControl(false),
    contentLanguage: new FormControl('en'),
  });
  private userPreferences?: UserPreferences;

  constructor(
    public readonly userManagementDetailService: UserManagementDetailService,
    public readonly localizationRepository: LocalizationRepository,
    private readonly toasterService: ToasterService,
    private readonly messageService: MessageService,
  ) {
    this.userManagementDetailService.fetchUserPreferences().subscribe((userPreferences: UserPreferences) => {
      this._setUserPreferences(userPreferences);
      this._subscribeToUserPreferencesChanges(userPreferences);
    });
  }

  onSubmit() {
    this.userManagementDetailService
      .updateUserPreferences(this.userPreferences!, this.form.value as IUserPreferences)
      .subscribe(() => this.toasterService.showToast({ message: translate(`${this.TRANSLOCO_SCOPE}.toast.saved`) }));
  }

  public hasTemplateToUpdateUserPreferences() {
    return !!this.userPreferences?.hasTemplate(UserManagementRelations.USER_UPDATE_REL);
  }

  private _setUserPreferences(userPreferences: UserPreferences) {
    this.userPreferences = userPreferences;
    this.form.patchValue(userPreferences);
  }

  private _subscribeToUserPreferencesChanges(userPreferences: UserPreferences) {
    if (userPreferences.hasLink(WEBSOCKET_REL)) {
      this.messageService
        .multicast<UserPreferencesChangedMessage>(userPreferences.getLink(WEBSOCKET_REL)!.href)
        .pipe(
          untilDestroyed(this),
          switchMap(() => this.userManagementDetailService.fetchUserPreferences()),
        )
        .subscribe((fetchedUserPreferences) => this._setUserPreferences(fetchedUserPreferences));
    }
  }
}
