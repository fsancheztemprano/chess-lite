import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MenuData, TicTacToeRelations } from '@app/ui/shared/domain';
import { HalFormService } from '@hal-form-client';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-tic-tac-toe-sidenav-item',
  templateUrl: './tic-tac-toe-sidenav-item.component.html',
  styleUrls: ['./tic-tac-toe-sidenav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeSidenavItemComponent {
  @Output() toggleSidenav = new EventEmitter();

  constructor(private readonly halFormService: HalFormService, private readonly translocoService: TranslocoService) {}

  items: MenuData[] = [
    {
      id: 'tic-tac-toe-menu-option',
      icon: 'tag',
      title$: this.translocoService.selectTranslate('core.sidenav.tic-tac-toe.title'),
      route: ['/tic-tac-toe'],
      visible$: this.halFormService.hasLink(TicTacToeRelations.TIC_TAC_TOE_REL),
    },
  ];
}
