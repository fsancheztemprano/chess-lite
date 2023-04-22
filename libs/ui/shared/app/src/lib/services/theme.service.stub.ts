import { Injectable } from '@angular/core';
import { IThemeModel, ThemeModel } from '@app/ui/shared/domain';
import { Resource } from '@hal-form-client';
import { Observable, of } from 'rxjs';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class StubThemeService implements Partial<ThemeService> {
  public getTheme(): Observable<ThemeModel> {
    return of(new ThemeModel({}));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateTheme(_: Resource, __: IThemeModel): Observable<ThemeModel> {
    return of(new ThemeModel({}));
  }

  public initializeTheme(): Observable<ThemeModel> {
    return of(new ThemeModel({}));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateAppColors(): void {}
}

export const stubThemeServiceProvider = {
  provide: ThemeService,
  useClass: StubThemeService,
};
