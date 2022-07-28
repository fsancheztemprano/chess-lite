import { Injectable } from '@angular/core';
import { Session, User } from '@app/ui/shared/domain';
import { of } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class StubSessionService implements Partial<SessionService> {
  initialize = (session: Session) => of(new User(session));
  clearSession = () => of(new User());
}

export const stubSessionServiceProvider = {
  provide: SessionService,
  useClass: StubSessionService,
};
