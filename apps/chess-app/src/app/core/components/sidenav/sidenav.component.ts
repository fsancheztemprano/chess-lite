import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '../../../auth/services/auth.service';
import { LoginService } from '../../../auth/services/login.service';
import { SidenavService } from '../../services/sidenav.service';

interface SidenavEntry {
  route: string;
  icon: string;
  label: string;
}

@UntilDestroy()
@Component({
  selector: 'chess-lite-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;

  constructor(
    public readonly sidenavService: SidenavService,
    public readonly authService: AuthService,
    private readonly loginService: LoginService,
  ) {
    this._subscribeToSidenavOpenEvent();
  }

  private _subscribeToSidenavOpenEvent() {
    this.sidenavService.isOpen$.pipe(untilDestroyed(this)).subscribe((isOpen) => this.sidenav?.toggle(isOpen));
  }

  public toggleSidenav() {
    if (this.sidenav?.mode === 'over') {
      this.sidenavService.toggle();
    }
  }

  public logout(): void {
    this.loginService.logout();
  }
}
