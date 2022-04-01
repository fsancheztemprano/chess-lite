import { Injectable } from '@angular/core';
import { SessionService } from '@app/ui/shared/app';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppInitializationService {
  constructor(private readonly sessionService: SessionService) {}

  initialize(): Observable<unknown> {
    this.sessionService.initialize().subscribe();
    return of(void 0);
  }
}
