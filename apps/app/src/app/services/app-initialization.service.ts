import { Injectable } from '@angular/core';
import { initialize } from '@app/ui/shared/app';
import { Actions } from '@ngneat/effects-ng';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppInitializationService {
  constructor(private readonly actions: Actions) {}

  initialize(): Observable<unknown> {
    this.actions.dispatch(initialize({}));
    return of(void 0);
  }
}
