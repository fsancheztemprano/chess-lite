import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AdministrationService } from '../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class AdministrationGuard implements CanLoad, CanActivate {
  private initialization?: Observable<boolean>;

  constructor(private readonly administrationService: AdministrationService) {}

  canActivate(): Observable<boolean> {
    return this._guard();
  }

  canLoad(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    if (!this.initialization) {
      this.initialization = this.administrationService.initialize().pipe(
        map((resources) => !!resources),
        shareReplay(),
        catchError(() => of(false)),
      );
    }
    return this.initialization.pipe();
  }
}
