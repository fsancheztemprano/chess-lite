import { Injectable } from '@angular/core';
import { HalFormService, Resource } from '@hal-form-client';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeService extends HalFormService {
  constructor(private readonly halFormService: HalFormService) {
    super();
  }

  public override initialize(): Observable<Resource> {
    return this.halFormService.getLink('ttc-game').pipe(
      switchMap((link) => {
        this._rootUrl = link?.href || '';
        return this._rootUrl?.length
          ? super.initialize()
          : throwError(() => new Error('Tic Tac Toe Initialization Error'));
      }),
    );
  }
}
