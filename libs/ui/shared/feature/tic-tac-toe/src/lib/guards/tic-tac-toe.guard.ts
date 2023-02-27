import { Injectable } from '@angular/core';
import { CanMatch, Router, UrlTree } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TicTacToeService } from '../services/tic-tac-toe.service';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeGuard implements CanMatch {
  private initialization?: Observable<boolean | UrlTree>;

  constructor(private readonly ticTacToeService: TicTacToeService, private readonly router: Router) {}

  canMatch(): Observable<boolean | UrlTree> {
    return this._guard();
  }

  private _guard(): Observable<boolean | UrlTree> {
    if (!this.initialization) {
      this.initialization = this.ticTacToeService.initialize().pipe(
        map((resources) => !!resources),
        shareReplay(),
        catchError(() => of(this.router.parseUrl('/'))),
      );
    }
    return this.initialization.pipe();
  }
}
