import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalSettingsComponent } from '../components/global-settings/global-settings.component';
import { GlobalSettingsService } from '../services/global-settings.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsGuard implements CanActivate, CanDeactivate<GlobalSettingsComponent> {
  constructor(private readonly globalSettingsService: GlobalSettingsService) {}

  canActivate(): Observable<boolean> {
    return this.globalSettingsService.initialize().pipe(map((globalSettings) => !!globalSettings));
  }

  canDeactivate(): boolean {
    this.globalSettingsService.tearDown();
    return true;
  }
}
