import { IResource, Resource } from '@hal-form-client';
import { map, Observable } from 'rxjs';

export interface ITicTacToeGame extends IResource {
  id: string;
  status: TicTacToeGameStatus;
  private: boolean;
  playersX: ITicTacToePlayer;
  playersO: ITicTacToePlayer;
  board?: string;
  turn?: TicTacToeGamePlayer;
  lastActivityAt: number;
  requestedAt: number;
  startedAt?: number;
  finishedAt?: number;
}

export class TicTacToeGame extends Resource implements IResource {
  id!: string;
  status!: TicTacToeGameStatus;
  private!: boolean;
  playerX!: ITicTacToePlayer;
  playerO!: ITicTacToePlayer;
  board?: string;
  turn?: TicTacToeGamePlayer;
  lastActivityAt!: number;
  requestedAt!: number;
  startedAt?: number;
  finishedAt?: number;

  move(cell: string): Observable<TicTacToeGameMove> {
    return this.affordTemplate<TicTacToeGameMove>({ template: 'move', body: { cell } });
  }

  canMove(cell: string): boolean {
    return !!this.getTemplate('move')?.canAffordProperty('cell', cell);
  }

  changeStatus(status: TicTacToeGameStatus.REJECTED | TicTacToeGameStatus.IN_PROGRESS): Observable<Resource> {
    return this.affordTemplate({ template: 'status', body: { status } });
  }

  canChangeStatus(status: TicTacToeGameStatus.REJECTED | TicTacToeGameStatus.IN_PROGRESS): boolean {
    return !!this.getTemplate('status')?.canAffordProperty('status', status);
  }

  getMoves(): Observable<ITicTacToeGameMove[]> {
    return this.getLinkOrThrow('moves')
      .follow()
      .pipe(map((resource) => resource.getEmbeddedCollection('ticTacToeGameMoveModels')));
  }
}

export enum TicTacToeGameStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export enum TicTacToeGamePlayer {
  NONE = 'NONE',
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

export class TicTacToePlayer extends Resource implements ITicTacToePlayer {
  id!: string;
  username!: string;
  wins!: number;
  losses!: number;
  draws!: number;
}

export interface ITicTacToeGameMove {
  id: string;
  gameId: string;
  number: number;
  cell: string;
  token: TicTacToeGamePlayer;
  board: string;
  player: ITicTacToePlayer;
  movedAt: number;
  moveTime: number;
}

export class TicTacToeGameMove extends Resource implements ITicTacToeGameMove {
  id!: string;
  gameId!: string;
  number!: number;
  cell!: string;
  token!: TicTacToeGamePlayer;
  board!: string;
  player!: ITicTacToePlayer;
  movedAt!: number;
  moveTime!: number;
}
