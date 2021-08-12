import { Injectable } from '@angular/core';
import { HalFormService } from '@hal-form-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

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
