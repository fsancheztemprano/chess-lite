import { Injectable } from '@angular/core';
import { Session } from '@app/ui/shared/domain';
import { Resource } from '@hal-form-client';
import { of } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class StubSessionService implements Partial<SessionService> {
  initialize = (session: Session) => of(new Resource(session));
  clearSession = () => of(new Resource());
}

export const stubSessionServiceProvider = {
  provide: SessionService,
  useClass: StubSessionService,
};
