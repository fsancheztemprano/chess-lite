import { Injectable } from '@angular/core';
import { IThemeModel, ThemeModel } from '@app/ui/shared/domain';
import { TinyColor } from '@ctrl/tinycolor';
import { HalFormService, Resource } from '@hal-form-client';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private readonly halFormService: HalFormService) {}

  public getTheme(): Observable<ThemeModel> {
    return this.halFormService.followLink<ThemeModel>({ link: 'theme' });
  }

  public updateTheme(resource: Resource, colors: IThemeModel): Observable<ThemeModel> {
    return resource.getTemplateOrThrow('update').afford({
      body: colors,
    });
  }

  public initializeTheme(): Observable<ThemeModel> {
    return this.getTheme().pipe(tap((theme) => this.updateAppColors(theme)));
  }

  public updateAppColors(colors: IThemeModel): void {
    colors?.primaryColor && this._generateHues('primary', colors?.primaryColor);
    colors?.accentColor && this._generateHues('accent', colors?.accentColor);
    colors?.warnColor && this._generateHues('warn', colors?.warnColor);
  }

  private _generateHues(type: string, baseColor: string): void {
    const colorPalette: { [key: string]: TinyColor } = this._getColorHues(baseColor);

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

  private _getColorHues(hex: string): { [key: string]: TinyColor } {
    const baseColor = new TinyColor(hex);
    if (!baseColor.isValid) {
      return {};
    }
    const baseLight = new TinyColor('#ffffff');
    const baseDark = this._multiply(baseColor, baseColor);
    const baseTetrad = baseColor.tetrad();
    return {
      '50': baseLight.mix(baseColor, 12),
      '100': baseLight.mix(baseColor, 30),
      '200': baseLight.mix(baseColor, 50),
      '300': baseLight.mix(baseColor, 70),
      '400': baseLight.mix(baseColor, 85),
      '500': baseColor,
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
