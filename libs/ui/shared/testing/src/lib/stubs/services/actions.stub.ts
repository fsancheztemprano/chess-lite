import { Injectable } from '@angular/core';
import { Actions } from '@ngneat/effects-ng';
import { noop } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StubActions implements Partial<Actions> {
  dispatch = noop;
}

export const stubActionsProvider = {
  provide: Actions,
  useClass: StubActions,
};
