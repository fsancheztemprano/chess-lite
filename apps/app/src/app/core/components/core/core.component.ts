import { OverlayContainer } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreComponentStyle, CoreService } from '../../services/core.service';
import { ThemeService } from '../../services/theme.service';

@UntilDestroy()
@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreComponent implements OnInit {
  @HostBinding('class.dark-mode') darkModeClass = false;

  public style: CoreComponentStyle = 'card';

  constructor(
    private readonly overlay: OverlayContainer,
    private readonly themeService: ThemeService,
    private readonly coreService: CoreService,
  ) {}

  ngOnInit(): void {
    this._subscribeToThemeChanges();
    this._subscribeToComponentStyle();
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

  private _subscribeToComponentStyle() {
    this.coreService
      .getCoreStyle()
      .pipe(untilDestroyed(this))
      .subscribe((style: CoreComponentStyle) => (this.style = style));
  }
}
