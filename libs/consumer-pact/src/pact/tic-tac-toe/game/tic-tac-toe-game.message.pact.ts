export namespace TicTacToeGameMessages {
  //channels:
  //          /ami/tic-tac-toe/games
  //          /ami/tic-tac-toe/games/{ticTacToeGameId}
  //          /ami/tic-tac-toe/players/{xUserId}
  //          /ami/tic-tac-toe/players/{oUserId}

  export const ticTacToeGameCreatedMessage = {
    tiTacToeGameId: 'tic-tac-toe-g1',
    playerXId: 'user-a-id',
    playerOId: 'user-b-id',
    nextMovePlayerId: 'user-b-id',
    action: 'CREATED',
  };

  export const ticTacToeGameUpdatedMessage = {
    tiTacToeGameId: 'tic-tac-toe-g1',
    playerXId: 'user-a-id',
    playerOId: 'user-b-id',
    nextMovePlayerId: 'user-a-id',
    action: 'UPDATED',
  };
}
