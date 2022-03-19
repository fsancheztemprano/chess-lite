import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AdministrationRelations, AuthRelations, CurrentUserRelations } from '@app/domain';
import { SessionService, SidenavService, UserService } from '@app/ui/shared';
import { HalFormService } from '@hal-form-client';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;

  constructor(
    public readonly sidenavService: SidenavService,
    public readonly userService: UserService,
    public readonly sessionService: SessionService,
    private readonly router: Router,
    private readonly halFormService: HalFormService,
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
    this.sessionService.clearSession().subscribe(() => this.router.navigate(['auth', 'login']));
  }

  public showLoginLink(): Observable<boolean> {
    return this.halFormService.hasLink(AuthRelations.LOGIN_RELATION);
  }

  public showSignupLink(): Observable<boolean> {
    return this.halFormService.hasLink(AuthRelations.SIGNUP_RELATION);
  }

  public showUserLink(): Observable<boolean> {
    return this.halFormService.hasLink(CurrentUserRelations.CURRENT_USER_REL);
  }

  public showAdministrationLink(): Observable<boolean> {
    return this.halFormService.hasLink(AdministrationRelations.ADMINISTRATION_REL);
  }
}
