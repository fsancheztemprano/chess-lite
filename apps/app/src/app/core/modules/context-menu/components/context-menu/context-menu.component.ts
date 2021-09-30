import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContextMenuService } from '../../services/context-menu.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent {
  constructor(public readonly contextMenuService: ContextMenuService) {}
}
