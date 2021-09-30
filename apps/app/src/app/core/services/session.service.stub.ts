import { Injectable } from '@angular/core';
import { User } from '@app/domain';
import { SessionService } from './session.service';

export interface Session {
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root',
})
export class StubSessionService implements Partial<SessionService> {}

export const stubSessionServiceProvider = {
  provide: SessionService,
  useClass: StubSessionService,
};
