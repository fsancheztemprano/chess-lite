import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent implements OnInit {
  darkMode = false;

  constructor(private readonly themeService: ThemeService, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.themeService.getDarkMode().subscribe((darkMode) => {
      this.darkMode = darkMode;
      this.cdr.detectChanges();
    });
  }

  onToggle($event: MatSlideToggleChange) {
    this.themeService.setDarkMode($event.checked);
  }
}
