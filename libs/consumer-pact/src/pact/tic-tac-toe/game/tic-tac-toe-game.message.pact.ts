export namespace TicTacToeGameMessages {
  //channels:
  //          /ami/tic-tac-toe/game
  //          /ami/tic-tac-toe/game/{ticTacToeGameId}
  //          /ami/tic-tac-toe/game/players
  //          /ami/tic-tac-toe/game/players/{xUserId}
  //          /ami/tic-tac-toe/game/players/{oUserId}

  export const ticTacToeGameCreatedMessage = {
    ticTacToeGameId: 'tic-tac-toe-g1',
    playerXId: 'user-a-id',
    playerOId: 'user-b-id',
    nextMovePlayerId: 'user-b-id',
    action: 'CREATED',
  };

  export const ticTacToeGameUpdatedMessage = {
    ticTacToeGameId: 'tic-tac-toe-g1',
    playerXId: 'user-a-id',
    playerOId: 'user-b-id',
    nextMovePlayerId: 'user-a-id',
    action: 'UPDATED',
  };
}
