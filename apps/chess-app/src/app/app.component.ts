import { Component, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from './core/services/theme.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'chess-lite-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @HostBinding('class.dark-mode') darkModeClass = false;

  constructor(private readonly overlay: OverlayContainer, private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this._subscribeToThemeChanges();
  }

  private _subscribeToThemeChanges(): void {
    this.themeService
      .getDarkMode()
      .pipe(untilDestroyed(this))
      .subscribe((darkMode) => {
        const darkClassName = 'dark-mode';
        this.darkModeClass = darkMode;
        if (darkMode) {
          this.overlay.getContainerElement().classList.add(darkClassName);
        } else {
          this.overlay.getContainerElement().classList.remove(darkClassName);
        }
      });
  }
}
