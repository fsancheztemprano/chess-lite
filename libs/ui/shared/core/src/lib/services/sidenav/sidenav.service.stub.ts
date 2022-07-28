import { Injectable } from '@angular/core';
import { BehaviorSubject, noop } from 'rxjs';
import { SidenavService } from './sidenav.service';

@Injectable({ providedIn: 'root' })
export class StubSidenavService implements Partial<SidenavService> {
  toggle = noop;
  isOpen$ = new BehaviorSubject<boolean>(true);
}

export const stubSidenavServiceProvider = {
  provide: SidenavService,
  useClass: StubSidenavService,
};
