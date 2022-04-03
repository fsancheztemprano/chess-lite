import { Injectable } from '@angular/core';
import { User, UserPreferences } from '@app/ui/shared/domain';
import { BehaviorSubject } from 'rxjs';
import { SessionRepository } from './session.repository';

@Injectable({ providedIn: 'root' })
export class StubSessionRepository implements Partial<SessionRepository> {
  user$ = new BehaviorSubject<User | undefined>(undefined);
  userPreferences$ = new BehaviorSubject<UserPreferences | undefined>(undefined);

  updateUser(user: User | undefined) {
    this.user$.next(user);
  }

  updateUserPreferences(userPreferences: UserPreferences) {
    this.userPreferences$.next(userPreferences);
  }
}

export const stubSessionRepositoryProvider = {
  provide: SessionRepository,
  useClass: StubSessionRepository,
};
