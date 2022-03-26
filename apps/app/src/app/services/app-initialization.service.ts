import { Injectable } from '@angular/core';
import { SessionService } from '@app/ui/shared/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppInitializationService {
  constructor(private readonly sessionService: SessionService) {}

  initialize(): Observable<unknown> {
    return this.sessionService.initialize();
  }
}
