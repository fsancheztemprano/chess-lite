import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { CurrentUserRelations } from '@app/ui/shared/domain';
import { HalFormService } from '@hal-form-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsGuard implements CanLoad, CanActivate {
  constructor(private readonly halFormsService: HalFormService) {}

  canActivate(): Observable<boolean> {
    return this._guard();
  }

  canLoad(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this.halFormsService.hasLink(CurrentUserRelations.CURRENT_USER_REL);
  }
}
