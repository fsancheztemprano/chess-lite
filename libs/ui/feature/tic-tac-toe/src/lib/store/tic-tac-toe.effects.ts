import { inject, Injectable } from '@angular/core';
import { IToastModel, SessionRepository, ToasterService } from '@app/ui/shared/app';
import {
  TicTacToeGameChangedMessage,
  TicTacToeGameChangedMessageAction,
  TicTacToeGamePlayer,
  TicTacToeGameStatus,
} from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { filterNil, select } from '@ngneat/elf';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, iif, map, of, switchMap } from 'rxjs';
import { TicTacToeRepository } from './tic-tac-toe.repository';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class TicTacToeEffects {
  private readonly repository: TicTacToeRepository = inject(TicTacToeRepository);
  private readonly service: TicTacToeService = inject(TicTacToeService);
  private readonly sessionRepository: SessionRepository = inject(SessionRepository);
  private readonly toastService: ToasterService = inject(ToasterService);

  constructor() {
    this.newGameNotifications();
    this.myTurnNotifications();
  }

  private newGameNotifications() {
    this.repository.newGameNotifications$
      .pipe(
        untilDestroyed(this),
        switchMap((onNewGame) =>
          iif(() => !!onNewGame, this.sessionRepository.user$.pipe(select((user) => user?.id)), of(null)),
        ),
        switchMap((playerId) =>
          iif(
            () => !!playerId,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.service.gamesPlayerChangedEvents(playerId!).pipe(
              filter((message) => message.action === TicTacToeGameChangedMessageAction.CREATED),
              filter((message) => message.playerO.id === playerId),
            ),
            of(null),
          ),
        ),
        filterNil(),
      )
      .subscribe((message: TicTacToeGameChangedMessage) => {
        this.toastService.showLinkToast({
          title: 'Game Request',
          message: `You have a new game request from ${message.playerX.username}`,
          link: `./tic-tac-toe/games/${message.gameId}`,
          linkSelf: true,
          linkCaption: 'Open Game',
        });
      });
  }

  private myTurnNotifications() {
    this.repository.myTurnNotifications$
      .pipe(
        untilDestroyed(this),
        switchMap((onMyTurn) =>
          iif(() => !!onMyTurn, this.sessionRepository.user$.pipe(select((user) => user?.id)), of(null)),
        ),
        switchMap((playerId) =>
          iif(
            () => !!playerId,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.service.gamesPlayerChangedEvents(playerId!).pipe(
              filter((message) => message.action === TicTacToeGameChangedMessageAction.UPDATED),
              map((message) => ({
                ...message,
                player: message.playerO.id === playerId ? TicTacToeGamePlayer.O : TicTacToeGamePlayer.X,
              })),
            ),
            of(null),
          ),
        ),
        filterNil(),
      )
      .subscribe((message: TicTacToeGameChangedMessage & { player: TicTacToeGamePlayer }) => {
        const toast: IToastModel = {
          link: `./tic-tac-toe/games/${message.gameId}`,
          linkSelf: true,
          linkCaption: 'Open Game',
        };
        const opponent = message.player === TicTacToeGamePlayer.O ? message.playerX.username : message.playerO.username;
        switch (message.status) {
          case TicTacToeGameStatus.FINISHED:
            toast.title = 'Game Finished';
            toast.message = `You have ${message.turn === message.player ? 'won' : 'lost'} the game vs ${opponent} `;
            break;
          case TicTacToeGameStatus.REJECTED:
            toast.title = 'Game Rejected';
            toast.message = `Your game request to ${opponent} has been rejected`;
            break;
          case TicTacToeGameStatus.IN_PROGRESS:
            if (message.turn === message.player) {
              toast.title = 'Your Turn';
              toast.message = `It's your turn to play vs ${opponent}`;
            }
            break;
        }
        if (toast.title) {
          this.toastService.showLinkToast(toast);
        }
      });
  }
}
