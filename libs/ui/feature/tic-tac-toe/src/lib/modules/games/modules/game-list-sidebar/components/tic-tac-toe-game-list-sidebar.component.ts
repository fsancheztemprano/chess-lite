import { ChangeDetectionStrategy, Component, inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TicTacToeGameStatus } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map } from 'rxjs';
import { TicTacToeGameListFilterService } from '../../../services/tic-tac-toe-game-list-filter.service';

@Component({
  selector: 'app-tic-tac-toe-game-list-sidebar',
  templateUrl: './tic-tac-toe-game-list-sidebar.component.html',
  styleUrls: ['./tic-tac-toe-game-list-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TicTacToeGameListSidebarComponent implements OnDestroy {
  protected readonly filterService: TicTacToeGameListFilterService = inject(TicTacToeGameListFilterService);
  public readonly service = inject(TicTacToeService);
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'myGames',
      type: 'toggle',
      props: {
        label: 'tic-tac-toe.game-list.sidebar.my-games.label',
        translate: true,
        appearance: 'outline',
      },
    },
    {
      key: 'player',
      type: 'autocomplete',
      props: {
        label: 'tic-tac-toe.game-list.sidebar.player-filter.label',
        translate: true,
        appearance: 'outline',
        filter: (value: string) =>
          this.service.findPlayers(value).pipe(map((players) => players.map((player) => player.username))),
      },
    },
    {
      key: 'status',
      type: 'multicheckbox',
      props: {
        label: 'tic-tac-toe.game-list.sidebar.status-filter.label',
        translate: true,
        multiple: true,
        selectAllOption: 'Select All',
        appearance: 'outline',
        options: [
          { value: TicTacToeGameStatus.PENDING, label: TicTacToeGameStatus.PENDING },
          { value: TicTacToeGameStatus.IN_PROGRESS, label: TicTacToeGameStatus.IN_PROGRESS },
          { value: TicTacToeGameStatus.REJECTED, label: TicTacToeGameStatus.REJECTED },
          { value: TicTacToeGameStatus.FINISHED, label: TicTacToeGameStatus.FINISHED },
        ],
        translateOptions: 'tic-tac-toe.game-list.sidebar.status-filter.options',
      },
    },
  ];

  ngOnDestroy(): void {
    this.filterService.setFilters();
  }
}
