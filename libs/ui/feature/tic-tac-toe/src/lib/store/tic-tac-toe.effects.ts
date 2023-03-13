import { inject, Injectable } from '@angular/core';
import { SessionRepository, ToasterService } from '@app/ui/shared/app';
import { TicTacToeGameChangedMessageAction } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { select } from '@ngneat/elf';
import { filter, switchMap, tap } from 'rxjs';
import { TicTacToeRepository } from './tic-tac-toe.repository';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeEffects {
  private readonly repository: TicTacToeRepository = inject(TicTacToeRepository);
  private readonly service: TicTacToeService = inject(TicTacToeService);
  private readonly sessionRepository: SessionRepository = inject(SessionRepository);
  private readonly toastService: ToasterService = inject(ToasterService);

  constructor() {
    this.repository.newGameNotifications$
      .pipe(
        filter((newGames) => !!newGames),
        switchMap(() => this.sessionRepository.user$.pipe(select((user) => user?.id))),
        tap(console.log),
        filter((playerId) => !!playerId),
        switchMap((playerId) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.service.gamesPlayerChangedEvents(playerId!).pipe(
            tap(console.log),
            filter((message) => message.playerO.id === playerId),
          ),
        ),
        filter((message) => message.action === TicTacToeGameChangedMessageAction.CREATED),
      )
      .subscribe((message) => {
        console.log('newGames', message);
        if (message) {
          this.toastService.showLinkToast({
            title: 'Game Request',
            message: `You have a new game request from ${message.playerX.username}`,
          });
        }
      });
  }
}
