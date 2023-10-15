import {
  TicTacToeGameChangedMessage,
  TicTacToeGameChangedMessageAction,
  TicTacToeGamePlayer,
  TicTacToeGameStatus,
} from '@app/ui/shared/domain';
import { JsonMap } from '@pact-foundation/pact/src/common/jsonTypes';

export namespace TicTacToeGameMessages {
  //channels:
  //          /ami/tic-tac-toe/game
  //          /ami/tic-tac-toe/game/{ticTacToeGameId}
  //          /ami/tic-tac-toe/game/players/{xUserId}
  //          /ami/tic-tac-toe/game/players/{oUserId}

  export const ticTacToeGameCreatedMessage: TicTacToeGameChangedMessage & JsonMap = {
    gameId: 'tic-tac-toe-g1',
    playerX: { id: 'tic-tac-toe-p1', username: 'tic-tac-toe-p1' },
    playerO: { id: 'tic-tac-toe-p2', username: 'tic-tac-toe-p2' },
    turn: TicTacToeGamePlayer.O,
    status: TicTacToeGameStatus.PENDING,
    action: TicTacToeGameChangedMessageAction.CREATED,
  };

  export const ticTacToeGameUpdatedMessage: TicTacToeGameChangedMessage & JsonMap = {
    gameId: 'tic-tac-toe-g1',
    playerX: { id: 'tic-tac-toe-p1', username: 'tic-tac-toe-p1' },
    playerO: { id: 'tic-tac-toe-p2', username: 'tic-tac-toe-p2' },
    turn: TicTacToeGamePlayer.X,
    status: TicTacToeGameStatus.IN_PROGRESS,
    action: TicTacToeGameChangedMessageAction.UPDATED,
  };
}
