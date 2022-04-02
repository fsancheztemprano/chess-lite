import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemeRepository } from '@app/ui/shared/store';

@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent implements OnInit {
  public darkMode = false;

  constructor(private readonly themeRepository: ThemeRepository, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.themeRepository.darkMode$.subscribe((darkMode) => {
      this.darkMode = darkMode;
      this.cdr.detectChanges();
    });
  }

  onToggle($event: MatSlideToggleChange) {
    this.themeRepository.updateDarkMode($event.checked);
  }
}
