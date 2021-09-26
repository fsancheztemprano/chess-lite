import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CoreService } from '../../../../../../../../core/services/core.service';
import { TiledMenuTileData } from '../../../../../../../../shared/modules/tiled-menu/components/tiled-menu-tile/tiled-menu-tile.component';

@Component({
  selector: 'app-user-management-home',
  templateUrl: './user-management-home.component.html',
  styleUrls: ['./user-management-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementHomeComponent implements OnDestroy {
  tiles: TiledMenuTileData[] = [
    {
      icon: 'contacts',
      title: 'User List',
      subtitle: 'List of all users',
      link: 'list',
    },
    {
      icon: 'person_add',
      title: 'Create User',
      subtitle: 'Create a new User Account.',
      link: 'create',
    },
  ];

  constructor(private readonly coreService: CoreService) {
    this.coreService.setCoreStyle('raw');
  }

  ngOnDestroy(): void {
    this.coreService.reset();
  }
}
