import { Injectable } from '@angular/core';
import { HalFormService } from '@chess-lite/hal-form-client';
import { AuthService } from '@ui/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  constructor(private readonly halFormService: HalFormService, private readonly authService: AuthService) {}

  init(): Observable<unknown> {
    return this.halFormService
      .initialize()
      .pipe(tap(() => this.authService.isAuthenticated() && this.authService.fetchCurrentUser().subscribe()));
  }
}
