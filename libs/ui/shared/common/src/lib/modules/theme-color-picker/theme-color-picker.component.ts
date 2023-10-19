import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IThemeModel } from '@app/ui/shared/domain';
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
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  public readonly palettes = ['primary', 'accent', 'warn'];
  public readonly form = new FormGroup({
    primaryColor: new FormControl<string | null>(null),
    accentColor: new FormControl<string | null>(null),
    warnColor: new FormControl<string | null>(null),
  });

  @Input() colors?: IThemeModel;
  @Input() disable = true;

  @Output() colorChanges = (<Observable<IThemeModel>>this.form.valueChanges).pipe(skip(1));

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.colors.isFirstChange()) {
      this.form.patchValue(changes.colors.currentValue, { emitEvent: false });
    }
    if (this.disable) {
      this.form.disable();
    } else {
      this.form.enable();
    }
    setTimeout(() => this.cdr.detectChanges(), 100);
  }
}
