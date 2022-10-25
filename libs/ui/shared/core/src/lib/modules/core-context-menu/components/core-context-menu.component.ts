import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CoreContextMenuService } from '../services/core-context-menu.service';

@Component({
  selector: 'app-core-context-menu',
  templateUrl: './core-context-menu.component.html',
  styleUrls: ['./core-context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreContextMenuComponent {
  constructor(public readonly coreContextMenuService: CoreContextMenuService) {}
}
