import { Injectable } from '@angular/core';
import { CanMatch } from '@angular/router';
import { CurrentUserRelations } from '@app/ui/shared/domain';
import { HalFormService } from '@hal-form-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsGuard implements CanMatch {
  constructor(private readonly halFormsService: HalFormService) {}

  canMatch(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this.halFormsService.hasLink(CurrentUserRelations.CURRENT_USER_REL);
  }
}
