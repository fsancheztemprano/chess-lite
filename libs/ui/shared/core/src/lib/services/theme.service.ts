import { Injectable } from '@angular/core';
import { ThemeModel } from '@app/ui/shared/domain';
import { HalFormService, Resource } from '@hal-form-client';
import { Observable } from 'rxjs';
import { ColorProps } from '../store/theme/theme.repository';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private readonly halFormService: HalFormService) {}

  getTheme(): Observable<ThemeModel> {
    return this.halFormService.followLink<ThemeModel>({ link: 'theme' });
  }

  updateTheme(resource: Resource, colors: ColorProps): Observable<ThemeModel> {
    return resource.getTemplateOrThrow('update').afford({
      body: {
        primaryColor: colors.primary,
        accentColor: colors.accent,
        warnColor: colors.warn,
      },
    });
  }
}
