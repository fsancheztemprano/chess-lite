import { Injectable } from '@angular/core';
import { User, UserPreferences } from '@app/ui/shared/domain';
import { Reducer, select, setProps } from '@ngneat/elf';
import { Observable } from 'rxjs';
import { sessionStore } from './session.store';
import { SessionProps } from './session.store.model';

@Injectable({ providedIn: 'root' })
export class SessionRepository {
  user$: Observable<User | undefined> = sessionStore.pipe(select((core) => core.user));
  userPreferences$: Observable<UserPreferences | undefined> = sessionStore.pipe(select((core) => core.userPreferences));

  public updateSession(session: SessionProps) {
    sessionStore.update(
      session.userPreferences ? this._updateUserPreferences(session.userPreferences) : this._updateUser(session.user),
    );
  }

  private _updateUser(user: User | undefined): Reducer<SessionProps> {
    return setProps({
      user: user && new User({ ...user }),
      userPreferences: user && new UserPreferences({ ...user.userPreferences }),
    });
  }

  private _updateUserPreferences(userPreferences: UserPreferences): Reducer<SessionProps> {
    return setProps({ userPreferences: new UserPreferences({ ...userPreferences }) });
  }
}
