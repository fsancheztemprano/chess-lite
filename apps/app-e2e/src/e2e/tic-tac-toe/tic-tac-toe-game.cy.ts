import { Interception } from 'cypress/types/net-stubbing';

describe('Tic Tac Toe Game', () => {
  let gameId: string;

  beforeEach(() => {
    Cypress.session.clearAllSavedSessions();
    cy.setState(2).clearLocalStorage();
  });

  describe('as admin', () => {
    beforeEach(() => {
      cy.login('admin', '123456');
      cy.requestApi({
        method: 'POST',
        url: '/tic-tac-toe/game',
        body: {
          playerOUsername: 'e2e-user3',
          playerXUsername: 'e2e-user4',
          isPrivate: true,
        },
      }).then(({ body }) => {
        gameId = body.id;
        cy.interceptApi('POST', `/tic-tac-toe/game/${gameId}/move`).as('move');
        cy.interceptApi('GET', `/tic-tac-toe/game/${gameId}`).as('getGame');
        visitGame();
      });
    });

    it('should play a complete game', () => {
      cy.get('[data-cy="game-pending"]').within(() => cy.get('.right-button').click());

      clickCell('A1');
      clickCell('B1');
      clickCell('C1');
      clickCell('C2');
      clickCell('C3');
      clickCell('B3');
      clickCell('A3');
      clickCell('A2');
      clickCell('B2');
      cy.wait('@getGame');
      cy.get<Interception>('@getGame.11').its('response.body.status').should('eq', 'FINISHED');
    });

    it('should reject game', () => {
      cy.get('[data-cy="game-pending"]').within(() => cy.get('.left-button').click());
      visitGame();
      cy.get('[data-cy="game-rejected"]');
    });
  });

  describe('as players', () => {
    function session(username: string, password?: string) {
      return cy.session(username, () => cy.login(username, password || ''));
    }

    function clickCellAsPlayer(cell: string, player: string): void {
      session(player);
      visitGame();
      clickCell(cell);
    }

    beforeEach(() => {
      session('e2e-user3', 'e2e-user3');
      cy.requestApi({
        method: 'POST',
        url: '/tic-tac-toe/game',
        body: {
          playerOUsername: 'e2e-user4',
          isPrivate: true,
        },
      }).then(({ body }) => {
        gameId = body.id;
        cy.interceptApi('POST', `/tic-tac-toe/game/${gameId}/move`).as('move');
      });
    });

    it('should play a complete game', () => {
      session('e2e-user4', 'e2e-user4');
      visitGame();
      cy.get('[data-cy="game-pending"]').within(() => cy.get('.right-button').click());

      clickCellAsPlayer('A1', 'e2e-user3');
      clickCellAsPlayer('A2', 'e2e-user4');
      clickCellAsPlayer('A3', 'e2e-user3');
      clickCellAsPlayer('B3', 'e2e-user4');
      clickCellAsPlayer('C3', 'e2e-user3');
      clickCellAsPlayer('C2', 'e2e-user4');
      clickCellAsPlayer('C1', 'e2e-user3');
      clickCellAsPlayer('B1', 'e2e-user4');
      clickCellAsPlayer('B2', 'e2e-user3');

      cy.interceptApi('GET', `/tic-tac-toe/game/${gameId}`).as('getGame');
      session('e2e-user4', 'e2e-user4');
      visitGame();
      cy.wait('@getGame').its('response.body.status').should('eq', 'FINISHED');
    });

    it('should reject game', () => {
      session('e2e-user4', 'e2e-user4');
      visitGame();

      cy.get('[data-cy="game-pending"]').within(() => cy.get('.left-button').click());
      visitGame();
      cy.get('[data-cy="game-rejected"]');
    });
  });

  function visitGame() {
    return cy.visit(`/tic-tac-toe/games/${gameId}`);
  }

  function clickCell(cell: string): void {
    cy.get(`.cell.cell-${cell} .new-move-icon`).invoke('show').click();
    cy.wait('@move').its('response.statusCode').should('eq', 201);
  }
});
