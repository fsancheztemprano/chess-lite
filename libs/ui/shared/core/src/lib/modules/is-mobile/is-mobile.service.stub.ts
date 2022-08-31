import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IsMobileService } from './is-mobile.service';

@Injectable({ providedIn: 'root' })
export class StubIsMobileService implements Partial<IsMobileService> {
  private readonly isHandset: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isMobile$(): Observable<boolean> {
    return this.isHandset.asObservable();
  }

  get isDesktop$(): Observable<boolean> {
    return this.isHandset.pipe(map((isMobile) => !isMobile));
  }
}

export const stubIsMobileServiceProvider = {
  provide: IsMobileService,
  useClass: StubIsMobileService,
};
