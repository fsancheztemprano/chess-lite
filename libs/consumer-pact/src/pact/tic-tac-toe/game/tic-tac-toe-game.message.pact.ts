import {
  TicTacToeGameChangedMessage,
  TicTacToeGameChangedMessageAction,
  TicTacToeGamePlayer,
  TicTacToeGameStatus,
} from '@app/ui/shared/domain';

export namespace TicTacToeGameMessages {
  //channels:
  //          /ami/tic-tac-toe/game
  //          /ami/tic-tac-toe/game/{ticTacToeGameId}
  //          /ami/tic-tac-toe/game/players/{xUserId}
  //          /ami/tic-tac-toe/game/players/{oUserId}

  export const ticTacToeGameCreatedMessage: TicTacToeGameChangedMessage = {
    gameId: 'tic-tac-toe-g1',
    playerX: { id: 'tic-tac-toe-p1', username: 'user-a' },
    playerO: { id: 'tic-tac-toe-p2', username: 'user-b' },
    turn: TicTacToeGamePlayer.O,
    status: TicTacToeGameStatus.PENDING,
    action: TicTacToeGameChangedMessageAction.CREATED,
  };

  export const ticTacToeGameUpdatedMessage: TicTacToeGameChangedMessage = {
    gameId: 'tic-tac-toe-g1',
    playerX: { id: 'tic-tac-toe-p1', username: 'user-a' },
    playerO: { id: 'tic-tac-toe-p2', username: 'user-b' },
    turn: TicTacToeGamePlayer.X,
    status: TicTacToeGameStatus.IN_PROGRESS,
    action: TicTacToeGameChangedMessageAction.UPDATED,
  };
}
