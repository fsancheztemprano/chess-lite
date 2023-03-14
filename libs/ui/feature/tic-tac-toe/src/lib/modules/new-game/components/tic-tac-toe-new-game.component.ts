import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
  public readonly router = inject(Router);
  form = new FormGroup({});
  model: { playerOUsername?: string; isPrivate?: boolean; playerXUsername?: string } = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'playerXUsername',
      type: 'autocomplete',
      hide: !this.service.resource.getTemplate('create')?.canAffordProperty('playerXUsername'),
      props: {
        required: this.service.resource.getTemplate('create')?.getProperty('playerXUsername')?.required,
        label: 'tic-tac-toe.new-game.player-x.label',
        translate: true,
        appearance: 'outline',
        filter: (value: string) =>
          this.service.findPlayers(value).pipe(map((players) => players.map((player) => player.username))),
      },
    },
    {
      key: 'playerOUsername',
      type: 'autocomplete',
      props: {
        required: this.service.resource.getTemplate('create')?.getProperty('playerOUsername')?.required,
        label: 'tic-tac-toe.new-game.player-o.label',
        translate: true,
        appearance: 'outline',
        filter: (value: string) =>
          this.service.findPlayers(value).pipe(map((players) => players.map((player) => player.username))),
      },
    },
    {
      key: 'isPrivate',
      type: 'toggle',
      props: {
        label: 'tic-tac-toe.new-game.is-private.label',
        translate: true,
        appearance: 'outline',
      },
    },
  ];

  onSubmit(model: { playerOUsername?: string; isPrivate?: boolean; playerXUsername?: string }) {
    this.service.createGame(model).subscribe((game) => this.router.navigate(['tic-tac-toe', 'games', game.id]));
  }
}
