import { IResource, Resource } from '@hal-form-client';
import { Observable } from 'rxjs';

export interface ITicTacToeGame extends IResource {
  id: string;
  status: TicTacToeGameStatus;
  private: boolean;
  players: {
    x: ITicTacToePlayer;
    o: ITicTacToePlayer;
  };
  board?: string;
  result?: TicTacToeGamePlayer;
}

export class TicTacToeGame extends Resource implements IResource {
  id?: string;
  status?: TicTacToeGameStatus;
  private?: boolean;
  players?: {
    x: ITicTacToePlayer;
    o: ITicTacToePlayer;
  };
  board?: string;
  result?: TicTacToeGamePlayer;

  move(cell: string): Observable<unknown> {
    return this.affordTemplate({ template: 'move', body: { cell } });
  }

  changeStatus(status: TicTacToeGameStatus.REJECTED | TicTacToeGameStatus.IN_PROGRESS): Observable<Resource> {
    return this.affordTemplate({ template: 'status', body: { status } });
  }
}

export enum TicTacToeGameStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export enum TicTacToeGamePlayer {
  DRAW = 'DRAW',
  X = 'X',
  O = 'O',
}

export interface ITicTacToePlayer {
  id: string;
  username: string;
  wins: number;
  losses: number;
  draws: number;
}
