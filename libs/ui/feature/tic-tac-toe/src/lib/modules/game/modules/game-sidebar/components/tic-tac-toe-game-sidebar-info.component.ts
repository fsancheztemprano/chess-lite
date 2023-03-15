import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITicTacToeGame, TicTacToeGamePlayer, TicTacToeGameStatus } from '@app/ui/shared/domain';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-tic-tac-toe-game-sidebar-info',
  templateUrl: './tic-tac-toe-game-sidebar-info.component.html',
  styleUrls: ['./tic-tac-toe-game-sidebar-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameSidebarInfoComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  public model: ITicTacToeGame = this.route.snapshot.data.game;
  public readonly TicTacToeGameStatus = TicTacToeGameStatus;
  fields: FormlyFieldConfig[] = [
    {
      key: 'playerO.username',
      type: 'input',
      props: {
        label: 'tic-tac-toe.game.sidebar.info.player',
        translate: true,
        translateParams: { player: TicTacToeGamePlayer.O },
        appearance: 'outline',
        disabled: true,
      },
    },
    {
      key: 'playerX.username',
      type: 'input',
      props: {
        label: 'tic-tac-toe.game.sidebar.info.player',
        translate: true,
        translateParams: { player: TicTacToeGamePlayer.O },
        appearance: 'outline',
        disabled: true,
      },
    },
    {
      key: 'isPrivate',
      type: 'toggle',
      props: {
        label: 'tic-tac-toe.game.sidebar.info.is-private',
        translate: true,
        appearance: 'outline',
        disabled: true,
      },
    },
    {
      key: 'status',
      type: 'select',
      props: {
        label: 'tic-tac-toe.game.sidebar.info.status',
        translate: true,
        appearance: 'outline',
        disabled: true,
        options: [
          { value: TicTacToeGameStatus.PENDING, label: TicTacToeGameStatus.PENDING },
          { value: TicTacToeGameStatus.IN_PROGRESS, label: TicTacToeGameStatus.IN_PROGRESS },
          { value: TicTacToeGameStatus.REJECTED, label: TicTacToeGameStatus.REJECTED },
          { value: TicTacToeGameStatus.FINISHED, label: TicTacToeGameStatus.FINISHED },
        ],
      },
    },
    {
      key: 'turn',
      type: 'select',
      props: {
        label: 'tic-tac-toe.game.sidebar.info.turn',
        translate: true,
        appearance: 'outline',
        disabled: true,
        options: [
          { value: TicTacToeGamePlayer.X, label: TicTacToeGamePlayer.X },
          { value: TicTacToeGamePlayer.O, label: TicTacToeGamePlayer.O },
        ],
      },
    },
  ];
}
