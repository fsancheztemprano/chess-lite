import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IsMobileService } from '../../shared/services/is-mobile.service';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private _isOpen$ = new BehaviorSubject(true);

  constructor(private readonly isMobileService: IsMobileService) {
    isMobileService.isMobile$.subscribe((isMobile) =>
      this._isOpen$.next(!isMobile)
    );
  }

  get isOpen$(): BehaviorSubject<boolean> {
    return this._isOpen$;
  }

  public toggle(isOpen = !this._isOpen$.value) {
    this._isOpen$.next(isOpen);
  }
}
