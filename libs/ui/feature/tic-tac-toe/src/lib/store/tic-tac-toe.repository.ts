import { Injectable } from '@angular/core';
import { createStore, select, setProp, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TicTacToeProps {
  notifications: {
    newGames?: boolean;
    myTurns?: boolean;
  };
}

const store = createStore(
  { name: 'ticTacToe' },
  withProps<TicTacToeProps>({
    notifications: {},
  }),
);

export const persist = persistState(store, {
  key: 'tic-tac-toe',
  storage: localStorageStrategy,
});

@Injectable({ providedIn: 'root' })
export class TicTacToeRepository {
  notifications$ = store.pipe(select((state) => state.notifications));
  newGameNotifications$: Observable<boolean | undefined> = this.notifications$.pipe(
    select((notifications) => notifications.newGames),
  );
  myTurnNotifications$: Observable<boolean | undefined> = this.notifications$.pipe(
    select((notifications) => notifications.myTurns),
  );

  updateNotifications(notifications: TicTacToeProps['notifications']) {
    store.update(setProp('notifications', notifications));
  }
}
