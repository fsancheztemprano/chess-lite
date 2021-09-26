import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CoreService } from '../../../../core/services/core.service';
import { TiledMenuTileData } from '../../../../shared/modules/tiled-menu/components/tiled-menu-tile/tiled-menu-tile.component';

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
    },
    {
      icon: 'admin_panel_settings',
      title: 'Administration',
      subtitle: 'Application settings',
      link: 'administration',
    },
  ];

  constructor(private readonly coreService: CoreService) {
    this.coreService.setCoreStyle('raw');
  }

  ngOnDestroy(): void {
    this.coreService.reset();
  }
}
