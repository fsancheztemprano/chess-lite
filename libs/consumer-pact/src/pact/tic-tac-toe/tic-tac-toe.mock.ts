import { TicTacToeGamePlayer } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';

export const createGameTemplate = {
  create: {
    method: 'POST',
    target: 'http://localhost/api/tic-tac-toe/game',
    properties: [
      { name: 'playerOUsername', type: 'text', required: true },
      { name: 'isPrivate', type: 'boolean' },
    ],
  },
};
export const adminCreateGameTemplate = {
  create: {
    ...createGameTemplate.create,
    properties: [...(createGameTemplate.create.properties || []), { name: 'playerXUsername', type: 'text' }],
  },
};

export function gameWithId(gameId: string, movesLink = false) {
  return {
    _links: {
      self: { href: `http://localhost/api/tic-tac-toe/game/${gameId}` },
      ws: { href: `/ami/tic-tac-toe/game/${gameId}` },
      ...(movesLink ? { moves: { href: `http://localhost/api/tic-tac-toe/game/${gameId}/move` } } : {}),
    },
    id: `${gameId}`,
    _templates: { ...defaultTemplate },
  };
}

export const pendingGame = {
  ...gameWithId('tic-tac-toe-g1'),
  status: 'PENDING',
  isPrivate: true,
  requestedAt: 1000000,
  lastActivityAt: 1000000,
  playerX: {
    id: 'tic-tac-toe-p1',
    username: 'tic-tac-toe-p1',
    wins: 0,
    losses: 0,
    draws: 0,
  },
  playerO: {
    id: 'tic-tac-toe-p2',
    username: 'tic-tac-toe-p2',
    wins: 0,
    losses: 0,
    draws: 0,
  },
  _templates: { ...defaultTemplate },
};
export const inProgressGame = {
  ...pendingGame,
  ...gameWithId('tic-tac-toe-g2', true),
  status: 'IN_PROGRESS',
  isPrivate: false,
  startedAt: 2000000,
  lastActivityAt: 2000000,
  turn: TicTacToeGamePlayer.X,
  board: 'XXOOO_X__',
};
export const rejectedGame = {
  ...pendingGame,
  ...gameWithId('tic-tac-toe-g3'),
  status: 'REJECTED',
  isPrivate: true,
  lastActivityAt: 3000000,
};
export const finishedGame = {
  ...inProgressGame,
  ...gameWithId('tic-tac-toe-g4', true),
  status: 'FINISHED',
  finishedAt: 4000000,
  lastActivityAt: 4000000,
  board: 'XXOOOOX_X',
  turn: TicTacToeGamePlayer.O,
};
export const moveTemplate = {
  move: {
    method: 'POST',
    target: 'http://localhost/api/tic-tac-toe/game/tic-tac-toe-g2/move',
    properties: [
      {
        name: 'cell',
        regex: '^(B3|C2|C3)$',
        required: true,
        type: 'text',
      },
    ],
  },
};
export const statusTemplate = {
  status: {
    method: 'PATCH',
    properties: [
      {
        name: 'status',
        type: 'text',
        regex: '^(REJECTED|IN_PROGRESS)$',
      },
    ],
  },
};
