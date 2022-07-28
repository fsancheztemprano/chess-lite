import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IsMobileService } from '../../modules/is-mobile';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private readonly _isOpen$ = new BehaviorSubject(true);

  constructor(private readonly isMobileService: IsMobileService) {
    this.isMobileService.isMobile$.subscribe((isMobile) => this._isOpen$.next(!isMobile));
  }

  get isOpen$(): Observable<boolean> {
    return this._isOpen$.asObservable();
  }

  public toggle(isOpen = !this._isOpen$.value) {
    this._isOpen$.next(isOpen);
  }
}
