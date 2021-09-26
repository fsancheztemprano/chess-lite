import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CoreService } from '../../../../../../core/services/core.service';
import { TiledMenuTileData } from '../../../../../../shared/modules/tiled-menu/components/tiled-menu-tile/tiled-menu-tile.component';

@Component({
  selector: 'app-user-settings-home',
  templateUrl: './user-settings-home.component.html',
  styleUrls: ['./user-settings-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsHomeComponent implements OnDestroy {
  tiles: TiledMenuTileData[] = [
    {
      icon: 'account_box',
      title: 'User Profile',
      subtitle: 'Edit your profile',
      link: 'profile',
    },
    {
      icon: 'account_circle',
      title: 'Upload Avatar',
      subtitle: 'Change your profile picture',
      link: 'avatar',
    },
    {
      icon: 'password',
      title: 'Change Password',
      subtitle: 'Secure your account',
      link: 'password',
    },
    {
      icon: 'delete_forever',
      title: 'Delete Account',
      subtitle: 'Remove your account',
      link: 'delete',
    },
    {
      icon: 'manage_accounts',
      title: 'Account Preferences',
      subtitle: 'Modify your application preferences',
      link: 'preferences',
    },
  ];

  constructor(private readonly coreService: CoreService) {
    this.coreService.setCoreStyle('raw');
  }

  ngOnDestroy(): void {
    this.coreService.reset();
  }
}
