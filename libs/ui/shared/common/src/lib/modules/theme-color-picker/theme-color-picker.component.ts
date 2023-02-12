import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgLetModule } from '@app/ui/shared/core';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-theme-color-picker',
  standalone: true,
  imports: [
    CommonModule,
    ColorPickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    NgLetModule,
  ],
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

  @Output() colorChanges = this.form.valueChanges;
  public primaryToggle = false;
}
