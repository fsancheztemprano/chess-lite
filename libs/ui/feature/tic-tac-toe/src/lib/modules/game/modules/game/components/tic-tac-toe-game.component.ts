import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { TicTacToeGameStatus } from '@app/ui/shared/domain';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TicTacToeGameService } from '../../../services/tic-tac-toe-game.service';

@UntilDestroy()
@Component({
  selector: 'app-tic-tac-toe-game',
  templateUrl: './tic-tac-toe-game.component.html',
  styleUrls: ['./tic-tac-toe-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameComponent implements OnDestroy {
  protected readonly service = inject(TicTacToeGameService);
  protected readonly TicTacToeGameStatus = TicTacToeGameStatus;

  ngOnDestroy(): void {
    this.service.teardown();
  }
}
