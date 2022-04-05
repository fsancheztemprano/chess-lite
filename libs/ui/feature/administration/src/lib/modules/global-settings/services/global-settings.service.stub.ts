import { Injectable } from '@angular/core';
import { GlobalSettings } from '@app/ui/shared/domain';
import { of } from 'rxjs';
import { GlobalSettingsService } from './global-settings.service';

@Injectable({
  providedIn: 'root',
})
export class StubGlobalSettingsService implements Partial<GlobalSettingsService> {
  get globalSettings$() {
    return of(new GlobalSettings({}));
  }

  canUpdateGlobalSettings = () => of(true);
}

export const stubGlobalSettingsServiceProvider = {
  provide: GlobalSettingsService,
  useClass: StubGlobalSettingsService,
};
