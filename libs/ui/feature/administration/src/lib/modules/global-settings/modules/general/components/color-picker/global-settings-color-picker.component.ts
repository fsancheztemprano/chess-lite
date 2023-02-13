import { Component } from '@angular/core';
import { ColorProps, updateTheme } from '@app/ui/shared/core';
import { Actions } from '@ngneat/effects-ng';

@Component({
  selector: 'app-global-settings-color-picker',
  templateUrl: './global-settings-color-picker.component.html',
  styleUrls: ['./global-settings-color-picker.component.scss'],
})
export class GlobalSettingsColorPickerComponent {
  constructor(private readonly actions: Actions) {}

  colorChanges($event: ColorProps) {
    this.actions.dispatch(updateTheme($event));
  }
}
