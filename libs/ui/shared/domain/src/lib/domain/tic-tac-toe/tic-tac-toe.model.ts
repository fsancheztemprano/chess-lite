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
  board?: string[][];
  result?: TicTacToeGameResult;
}

export class TicTacToeGame extends Resource implements IResource {
  id?: string;
  status?: TicTacToeGameStatus;
  private?: boolean;
  players?: {
    x: ITicTacToePlayer;
    o: ITicTacToePlayer;
  };
  board?: string[][];
  result?: TicTacToeGameResult;

  move(cell: string): Observable<unknown> {
    return this.affordTemplate({ template: 'move', body: { cell } });
  }
}

export enum TicTacToeGameStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export enum TicTacToeGameResult {
  DRAW = 'DRAW',
  X_WON = 'X_WON',
  O_WON = 'O_WON',
}

export interface ITicTacToePlayer {
  id: string;
  username: string;
  active?: boolean;
}
