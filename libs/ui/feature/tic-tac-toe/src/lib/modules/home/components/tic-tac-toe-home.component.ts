import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-tic-tac-toe-home',
  templateUrl: './tic-tac-toe-home.component.html',
  styleUrls: ['./tic-tac-toe-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeHomeComponent {
  public readonly tiles: MenuData[] = [
    {
      id: 'tic-tac-toe-games-tile',
      icon: 'toc',
      title$: this.translocoService.selectTranslate('tic-tac-toe.home.games-list.title'),
      subtitle$: this.translocoService.selectTranslate('tic-tac-toe.home.games-list.description'),
      route: 'games',
      visible$: this.ticTacToeService.hasGamesLink(),
    },
    {
      id: 'tic-tac-toe-new-game-tile',
      icon: 'not_started',
      title$: this.translocoService.selectTranslate('tic-tac-toe.home.new-game.title'),
      subtitle$: this.translocoService.selectTranslate('tic-tac-toe.home.new-game.description'),
      route: 'create',
      visible$: this.ticTacToeService.hasCreateGameTemplate(),
    },
  ];

  constructor(
    private readonly ticTacToeService: TicTacToeService,
    private readonly translocoService: TranslocoService,
  ) {}
}
