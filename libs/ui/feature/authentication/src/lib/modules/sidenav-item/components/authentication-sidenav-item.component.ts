import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { clearSession } from '@app/ui/shared/app';
import { AuthRelations, CurrentUserRelations, MenuData } from '@app/ui/shared/domain';
import { HalFormService } from '@hal-form-client';
import { Actions } from '@ngneat/effects-ng';

@Component({
  selector: 'app-authentication-sidenav-item',
  templateUrl: './authentication-sidenav-item.component.html',
  styleUrls: ['./authentication-sidenav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationSidenavItemComponent {
  @Output() toggleSidenav = new EventEmitter();

  constructor(
    private readonly halFormService: HalFormService,
    private readonly actions: Actions,
    private readonly router: Router,
  ) {}

  items: MenuData[] = [
    {
      icon: 'logout',
      title: 'Log Out',
      canShow: this.halFormService.hasLink(CurrentUserRelations.CURRENT_USER_REL),
      callback: this.logout.bind(this),
    },
    {
      icon: 'login',
      title: 'Log In',
      link: '/auth/login',
      canShow: this.halFormService.hasLink(AuthRelations.LOGIN_RELATION),
    },
    {
      icon: 'assignment_ind',
      title: 'Sign Up',
      link: '/auth/signup',
      canShow: this.halFormService.hasLink(AuthRelations.SIGNUP_RELATION),
    },
  ];

  public logout(): void {
    this.actions.dispatch(clearSession());
    this.router.navigate(['auth', 'login']);
  }
}
