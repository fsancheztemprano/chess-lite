import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IThemeModel, ThemeModel } from '@app/ui/shared/domain';
import { NgxColorsModule } from 'ngx-colors';
import { Observable, skip } from 'rxjs';

@Component({
  selector: 'app-theme-color-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxColorsModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './theme-color-picker.component.html',
  styleUrls: ['./theme-color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeColorPickerComponent implements OnChanges {
  public readonly palettes = ['primary', 'accent', 'warn'];
  public form = new FormGroup({
    primaryColor: new FormControl(''),
    accentColor: new FormControl(''),
    warnColor: new FormControl(''),
  });

  @Input() colors?: ThemeModel;
  @Input() disable = true;

  @Output() colorChanges = (<Observable<IThemeModel>>this.form.valueChanges).pipe(skip(1));

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.colors.currentValue) {
      this.form.patchValue(changes.colors.currentValue, { emitEvent: false });
    }
    if (this.disable) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
}
