import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';

@Component({
  selector: 'app-tiled-menu-tile',
  templateUrl: './tiled-menu-tile.component.html',
  styleUrls: ['./tiled-menu-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('hover', [
      state(
        'false',
        style({
          'box-shadow': '0 0 10px 0 rgba(0, 0, 0, 0.10)',
        }),
      ),
      state(
        'true',
        style({
          'box-shadow': '0 0 20px 0 rgba(0, 0, 0, 0.35)',
        }),
      ),
      transition('* <=> *', animate('0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940)')),
    ]),
  ],
})
export class TiledMenuTileComponent {
  @Input() tileData!: MenuData;

  public isMouseOver = 'false';

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isMouseOver = 'true';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isMouseOver = 'false';
  }
}
