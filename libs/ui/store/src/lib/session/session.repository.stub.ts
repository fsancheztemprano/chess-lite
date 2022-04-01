import { Injectable } from '@angular/core';
import { User, UserPreferences } from '@app/domain';
import { BehaviorSubject } from 'rxjs';
import { SessionRepository } from './session.repository';

@Injectable({ providedIn: 'root' })
export class StubSessionRepository implements Partial<SessionRepository> {
  user$ = new BehaviorSubject<User | null>(null);
  userPreferences$ = new BehaviorSubject<UserPreferences | null>(null);

  updateUser(user: User | null) {
    this.user$.next(user);
  }

  updateUserPreferences(userPreferences: UserPreferences | null) {
    this.userPreferences$.next(userPreferences);
  }
}

export const stubSessionRepositoryProvider = {
  provide: SessionRepository,
  useClass: StubSessionRepository,
};
