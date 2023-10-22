import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { LocalizationRepository, updateContentLanguage } from '@app/ui/shared/core';
import { Actions } from '@ngneat/effects-ng';

@Component({
  selector: 'app-locale-picker',
  templateUrl: './locale-picker.component.html',
  styleUrls: ['./locale-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LocalePickerComponent {
  constructor(
    public readonly localizationRepository: LocalizationRepository,
    private readonly actions: Actions,
  ) {}

  updateContentLanguage(contentLanguage: string) {
    this.actions.dispatch(updateContentLanguage({ contentLanguage }));
  }
}
