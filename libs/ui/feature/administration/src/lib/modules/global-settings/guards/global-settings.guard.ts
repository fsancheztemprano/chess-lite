import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalSettingsService } from '../services/global-settings.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsGuard {
  constructor(private readonly globalSettingsService: GlobalSettingsService) {}

  canActivate(): Observable<boolean> {
    return this.globalSettingsService.initialize().pipe(map((globalSettings) => !!globalSettings));
  }

  canDeactivate(): boolean {
    this.globalSettingsService.tearDown();
    return true;
  }
}
