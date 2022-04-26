import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';

@Component({
  selector: 'app-tiled-menu',
  templateUrl: './tiled-menu.component.html',
  styleUrls: ['./tiled-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiledMenuComponent {
  @Input() tiles: MenuData[] = [];
}
