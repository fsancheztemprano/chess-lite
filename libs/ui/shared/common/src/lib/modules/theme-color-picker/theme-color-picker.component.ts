import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColorProps } from '@app/ui/shared/core';
import { NgxColorsModule } from 'ngx-colors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-color-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxColorsModule],
  templateUrl: './theme-color-picker.component.html',
  styleUrls: ['./theme-color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeColorPickerComponent {
  public form = new FormGroup({
    primary: new FormControl(''),
    accent: new FormControl(''),
    warn: new FormControl(''),
  });

  @Output() colorChanges = this.form.valueChanges as Observable<ColorProps>;
}
