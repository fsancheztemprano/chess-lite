import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeRepository, updateDarkMode } from '@app/ui/shared/core';
import { Actions } from '@ngneat/effects-ng';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent {
  constructor(public readonly themeRepository: ThemeRepository, private readonly actions: Actions) {}

  setDarkMode(darkMode: boolean) {
    this.actions.dispatch(updateDarkMode({ darkMode }));
  }
}
