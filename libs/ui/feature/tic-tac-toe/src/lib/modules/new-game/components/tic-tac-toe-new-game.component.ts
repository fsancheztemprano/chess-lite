import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-tic-tac-toe-new-game',
  templateUrl: './tic-tac-toe-new-game.component.html',
  styleUrls: ['./tic-tac-toe-new-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeNewGameComponent {
  public readonly service = inject(TicTacToeService);
  form = new FormGroup({});
  model: { playerOUsername?: string; isPrivate?: boolean; playerXUsername?: string } = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'playerOUsername',
      type: 'autocomplete',
      props: {
        required: this.service.resource.getTemplate('create')?.getProperty('playerOUsername')?.required,
        label: 'Player O',
        appearance: 'outline',
        filter: (value: string) =>
          this.service.findPlayers(value).pipe(map((players) => players.map((player) => player.username))),
      },
    },
    {
      key: 'playerXUsername',
      type: 'autocomplete',
      hide: !this.service.resource.getTemplate('create')?.canAffordProperty('playerXUsername'),
      props: {
        required: this.service.resource.getTemplate('create')?.getProperty('playerXUsername')?.required,
        label: 'Player X',
        appearance: 'outline',
        filter: (value: string) =>
          this.service.findPlayers(value).pipe(map((players) => players.map((player) => player.username))),
      },
    },
    {
      key: 'isPrivate',
      type: 'toggle',
      props: {
        label: 'Private',
        appearance: 'outline',
      },
    },
  ];

  onSubmit(model: { playerOUsername?: string; isPrivate?: boolean; playerXUsername?: string }) {
    this.service.createGame(model).subscribe();
  }
}
