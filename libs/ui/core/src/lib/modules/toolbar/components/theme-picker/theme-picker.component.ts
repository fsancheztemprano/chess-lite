import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemeRepository, updateDarkMode } from '@app/ui/shared/core';
import { Actions } from '@ngneat/effects-ng';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent {
  public readonly darkMode$ = this.themeRepository.darkMode$.pipe(untilDestroyed(this));

  constructor(private readonly themeRepository: ThemeRepository, private readonly actions: Actions) {}

  onToggle($event: MatSlideToggleChange) {
    this.actions.dispatch(updateDarkMode({ darkMode: $event.checked }));
  }
}
