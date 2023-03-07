import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicTacToeGameListDatasource } from './tic-tac-toe-game-list.datasource';

@Component({
  selector: 'app-tic-tac-toe-game-list',
  templateUrl: './tic-tac-toe-game-list.component.html',
  styleUrls: ['./tic-tac-toe-game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameListComponent {
  protected readonly datasource = inject(TicTacToeGameListDatasource);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  displayedColumns: string[] = ['id', 'edit'];
}
