import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ThemeService } from '@app/ui/shared/app';
import { ThemeModel } from '@app/ui/shared/domain';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeResolver implements Resolve<ThemeModel> {
  constructor(private readonly themeService: ThemeService) {}

  resolve(): Observable<ThemeModel> {
    return this.themeService.getTheme();
  }
}
