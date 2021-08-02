import { Injectable } from '@angular/core';
import { HalFormService } from '@chess-lite/hal-form-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { IsMobileService } from '../../shared/services/is-mobile.service';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private _isOpen$ = new BehaviorSubject(true);

  constructor(private readonly isMobileService: IsMobileService, private readonly halFormService: HalFormService) {
    isMobileService.isMobile$.subscribe((isMobile) => this._isOpen$.next(!isMobile));
  }

  get isOpen$(): Observable<boolean> {
    return this._isOpen$.asObservable();
  }

  public toggle(isOpen = !this._isOpen$.value) {
    this._isOpen$.next(isOpen);
  }

  public showLoginLink(): Observable<boolean> {
    return this.halFormService.hasLink('login');
  }

  public showSignupLink(): Observable<boolean> {
    return this.halFormService.hasLink('signup');
  }

  public showUserLink(): Observable<boolean> {
    return this.halFormService.hasLink('current-user');
  }

  public showAdministrationLink(): Observable<boolean> {
    return this.halFormService.hasLink('administration');
  }
}
