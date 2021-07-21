import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdministrationService } from '../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class AdministrationGuard implements CanLoad {
  constructor(private readonly administrationService: AdministrationService) {}

  canLoad(): Observable<boolean> {
    return this.administrationService.initialize().pipe(
      map((resources) => !!resources),
      catchError(() => of(false)),
    );
  }
}
