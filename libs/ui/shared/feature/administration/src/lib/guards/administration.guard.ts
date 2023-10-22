import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AdministrationService } from '../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class AdministrationGuard {
  private initialization?: Observable<boolean | UrlTree>;

  constructor(
    private readonly administrationService: AdministrationService,
    private readonly router: Router,
  ) {}

  canMatch(): Observable<boolean | UrlTree> {
    return this._guard();
  }

  private _guard(): Observable<boolean | UrlTree> {
    if (!this.initialization) {
      this.initialization = this.administrationService.initialize().pipe(
        map((resources) => !!resources),
        shareReplay(),
        catchError(() => of(this.router.parseUrl('/'))),
      );
    }
    return this.initialization.pipe();
  }
}
