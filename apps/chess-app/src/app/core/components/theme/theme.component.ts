import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'chess-lite-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeComponent implements OnInit {
  darkModeControl = new FormControl(false);

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.getDarkMode().subscribe((darkMode) => {
      this.darkModeControl.setValue(darkMode, { emitEvent: false });
    });
    this.darkModeControl.valueChanges.subscribe((darkMode) => {
      this.themeService.setDarkMode(darkMode);
    });
  }
}
