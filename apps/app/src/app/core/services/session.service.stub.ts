import { Injectable } from '@angular/core';
import { User } from '@app/domain';
import { of } from 'rxjs';
import { SessionService } from './session.service';

export interface Session {
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root',
})
export class StubSessionService implements Partial<SessionService> {
  initialize = () => of(<User>{});
  clearSession = () => of(<User>{});
}

export const stubSessionServiceProvider = {
  provide: SessionService,
  useClass: StubSessionService,
};
