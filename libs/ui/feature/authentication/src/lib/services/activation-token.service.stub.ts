import { Injectable } from '@angular/core';
import { Template } from '@hal-form-client';
import { Observable, of } from 'rxjs';
import { ActivationTokenService } from './activation-token.service';

@Injectable({ providedIn: 'root' })
export class StubActivationTokenService implements Partial<ActivationTokenService> {
  getRequestActivationTokenTemplate = (): Observable<Template | null> => of({} as never);
}

export const stubActivationTokenServiceProvider = {
  provide: ActivationTokenService,
  useClass: StubActivationTokenService,
};
