import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContextMenuService, MenuOption } from '@app/ui/shared/core';
import { take } from 'rxjs';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent {
  constructor(public readonly contextMenuService: ContextMenuService) {}

  onMenuOptionClick(option: MenuOption) {
    option.callback ? option.callback() : option.observable?.pipe(take(1))?.subscribe();
  }
}
