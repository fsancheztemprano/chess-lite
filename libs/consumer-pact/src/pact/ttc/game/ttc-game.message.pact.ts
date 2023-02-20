export namespace TicTacToeGameMessages {
  //channels:
  //          /ami/ttc/games
  //          /ami/ttc/games/{ttcGameId}
  //          /ami/ttc/players/{xUserId}
  //          /ami/ttc/players/{oUserId}

  export const ttcGameCreatedMessage = {
    ttcGameId: 'ttcg1',
    playerXId: 'user-a-id',
    playerOId: 'user-b-id',
    nextMovePlayerId: 'user-b-id',
    action: 'CREATED',
  };

  export const ttcGameUpdatedMessage = {
    ttcGameId: 'ttcg1',
    playerXId: 'user-a-id',
    playerOId: 'user-b-id',
    nextMovePlayerId: 'user-a-id',
    action: 'UPDATED',
  };
}
