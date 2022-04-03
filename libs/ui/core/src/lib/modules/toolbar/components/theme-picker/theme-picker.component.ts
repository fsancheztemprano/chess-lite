import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemeRepository, updateDarkMode } from '@app/ui/shared/core';
import { Actions } from '@ngneat/effects-ng';

@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent implements OnInit {
  public darkMode = false;

  constructor(
    private readonly themeRepository: ThemeRepository,
    private readonly cdr: ChangeDetectorRef,
    private readonly actions: Actions,
  ) {}

  ngOnInit(): void {
    this.themeRepository.darkMode$.subscribe((darkMode) => {
      this.darkMode = darkMode;
      this.cdr.detectChanges();
    });
  }

  onToggle($event: MatSlideToggleChange) {
    this.actions.dispatch(updateDarkMode({ darkMode: $event.checked }));
  }
}
