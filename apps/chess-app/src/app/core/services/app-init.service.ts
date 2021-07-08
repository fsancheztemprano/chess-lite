import { Injectable } from '@angular/core';
import { User } from '@chess-lite/domain';
import { HalFormService } from '@chess-lite/hal-form-client';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  constructor(private readonly halFormService: HalFormService, private readonly authService: AuthService) {}

  init(): Observable<unknown> {
    return this.halFormService.initialize().pipe(
      switchMap((resource) => {
        if (resource.hasLink('user')) {
          return resource
            .getAssuredLink('user')
            .get()
            .pipe(tap((user) => this.authService.setUser(user as User)));
        }
        return EMPTY;
      })
    );
  }
}
