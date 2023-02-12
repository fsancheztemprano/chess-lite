import { Injectable } from '@angular/core';
import { updateSession } from '@app/ui/shared/app';
import { ColorProps, ThemeRepository, updateDarkMode, updateTheme } from '@app/ui/shared/core';
import { TinyColor } from '@ctrl/tinycolor';
import { createEffect, ofType } from '@ngneat/effects';
import { filterNil } from '@ngneat/elf';
import { map, startWith, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeEffects {
  constructor(private readonly themeRepository: ThemeRepository) {}

  updateDarkMode$ = createEffect((actions) =>
    actions.pipe(
      ofType(updateDarkMode),
      tap(({ darkMode }) => this.themeRepository.updateDarkMode(!!darkMode)),
    ),
  );

  syncUserPreferencesDarkMode$ = createEffect((actions) =>
    actions.pipe(
      ofType(updateSession),
      map(({ user, userPreferences }) => (user && user.userPreferences) || userPreferences),
      filterNil(),
      tap(({ darkMode }) => this.themeRepository.updateDarkMode(!!darkMode)),
    ),
  );

  updateTheme$ = createEffect((actions) =>
    actions.pipe(
      ofType(updateTheme),
      startWith({ colors: { primary: '#8bc34a', secondary: '#42a6f5' } as ColorProps }),
      tap(({ colors }) => {
        this.themeRepository.updateColors(colors);
        colors?.primary && this._generateHues('primary', colors?.primary);
        colors?.secondary && this._generateHues('accent', colors?.secondary);
        colors?.warn && this._generateHues('warn', colors?.warn);
      }),
    ),
  );

  private _generateHues(type: string, baseColor?: string): void {
    const colorPalette = this._getColorHues(baseColor);

    for (const tone in colorPalette) {
      const key = `--${type}-${tone}`;
      const value = `#${colorPalette[tone].toHex()}`;
      document.documentElement.style.setProperty(key, value);
    }
    for (const contrastTone in colorPalette) {
      const key = `--${type}-contrast-${contrastTone}`;
      const value = colorPalette[contrastTone].isLight() ? 'rgba(0, 0, 0, 0.87)' : 'white';
      document.documentElement.style.setProperty(key, value);
    }
  }

  private _getColorHues(hex: string = '#000000'): { [key: string]: TinyColor } {
    const baseColor = new TinyColor(hex);
    const baseLight = new TinyColor('#ffffff');
    const baseDark = this._multiply(baseColor, baseColor);
    const baseTetrad = baseColor.tetrad();
    return {
      '50': baseLight.mix(baseColor, 12),
      '100': baseLight.mix(baseColor, 30),
      '200': baseLight.mix(baseColor, 50),
      '300': baseLight.mix(baseColor, 70),
      '400': baseLight.mix(baseColor, 85),
      '500': baseLight.mix(baseColor, 100),
      '600': baseDark.mix(baseColor, 87),
      '700': baseDark.mix(baseColor, 70),
      '800': baseDark.mix(baseColor, 54),
      '900': baseDark.mix(baseColor, 25),
      A100: baseDark.mix(baseTetrad[4], 15).saturate(80).lighten(30),
      A200: baseDark.mix(baseTetrad[4], 15).saturate(80).lighten(20),
      A400: baseDark.mix(baseTetrad[4], 15).saturate(100).lighten(10),
      A700: baseDark.mix(baseTetrad[4], 15).saturate(100).lighten(5),
    };
  }

  private _multiply(rgb1: TinyColor, rgb2: TinyColor): TinyColor {
    return new TinyColor({
      r: Math.round((rgb1.r * rgb2.r) / 255),
      g: Math.round((rgb1.g * rgb2.g) / 255),
      b: Math.round((rgb1.b * rgb2.b) / 255),
    });
  }
}
