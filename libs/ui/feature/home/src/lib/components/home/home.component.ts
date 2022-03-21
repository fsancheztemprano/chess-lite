import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AdministrationRelations, AuthRelations, CurrentUserRelations } from '@app/domain';
import { CoreService, TiledMenuTileData } from '@app/ui/shared';
import { HalFormService } from '@hal-form-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnDestroy {
  tiles: TiledMenuTileData[] = [
    {
      icon: 'person',
      title: 'User Settings',
      subtitle: 'Manage User Settings',
      link: 'user',
      canShow: this.halFormService.hasLink(CurrentUserRelations.CURRENT_USER_REL),
    },
    {
      icon: 'admin_panel_settings',
      title: 'Administration',
      subtitle: 'Application settings',
      link: 'administration',
      canShow: this.halFormService.hasLink(AdministrationRelations.ADMINISTRATION_REL),
    },
    {
      icon: 'login',
      title: 'Login',
      subtitle: 'Log In to your account',
      link: 'auth',
      canShow: this.halFormService.hasLink(AuthRelations.LOGIN_RELATION),
    },
    {
      icon: 'assignment_ind',
      title: 'Sign Up',
      subtitle: 'Create a new Account',
      link: 'auth/signup',
      canShow: this.halFormService.hasLink(AuthRelations.SIGNUP_RELATION),
    },
  ];

  constructor(private readonly coreService: CoreService, private readonly halFormService: HalFormService) {
    this.coreService.setCoreStyle('raw');
  }

  ngOnDestroy(): void {
    this.coreService.reset();
  }
}
