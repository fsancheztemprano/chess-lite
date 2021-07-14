import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '../../../auth/services/auth.service';
import { LoginService } from '../../../auth/services/login.service';
import { SidenavService } from '../../services/sidenav.service';

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
    public readonly loginService: LoginService,
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
