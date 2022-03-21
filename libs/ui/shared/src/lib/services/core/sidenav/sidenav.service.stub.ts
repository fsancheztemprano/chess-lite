import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { SidenavService } from './sidenav.service';

@Injectable({ providedIn: 'root' })
export class StubSidenavService implements Partial<SidenavService> {
  isOpen$ = of(true);
  showLoginLink = () => of(true);
  showSignupLink = () => of(true);
  showUserLink = () => of(true);
  showAdministrationLink = () => of(true);
}

export const stubSidenavServiceProvider = {
  provide: SidenavService,
  useClass: StubSidenavService,
};
