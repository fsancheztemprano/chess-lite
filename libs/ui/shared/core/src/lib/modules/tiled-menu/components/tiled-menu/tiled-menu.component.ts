import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TiledMenuTileData } from '../../model/tiled-menu.model';

@Component({
  selector: 'app-tiled-menu',
  templateUrl: './tiled-menu.component.html',
  styleUrls: ['./tiled-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiledMenuComponent {
  @Input() tiles: TiledMenuTileData[] = [];
}
