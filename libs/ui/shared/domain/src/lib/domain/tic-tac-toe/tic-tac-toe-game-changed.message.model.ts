import { ApplicationMessage } from '../message/message.model';
import { TicTacToeGamePlayer, TicTacToeGameStatus } from './tic-tac-toe.model';

export interface TicTacToeGameChangedMessage extends ApplicationMessage {
  gameId: string;
  playerX: { id: string; username: string };
  playerO: { id: string; username: string };
  turn: TicTacToeGamePlayer;
  status: TicTacToeGameStatus;
  action: TicTacToeGameChangedMessageAction;
}

export enum TicTacToeGameChangedMessageAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
}
