export namespace TicTacToeGameMessages {
  //channels:
  //          /ami/ttc/games
  //          /ami/ttc/games/{ttcGameId}
  //          /ami/ttc/users/{xUserId}
  //          /ami/ttc/users/{oUserId}

  export const ttcGameCreatedMessage = {
    ttcGameId: 'ttcg1',
    playerAId: 'userId1',
    playerBId: 'userId2',
    nextMovePlayerId: 'userId2',
    action: 'CREATED',
  };

  export const ttcGameUpdatedMessage = {
    ttcGameId: 'ttcg1',
    playerAId: 'userId1',
    playerBId: 'userId2',
    nextMovePlayerId: 'userId1',
    action: 'UPDATED',
  };
}
