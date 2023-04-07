import { Interception } from 'cypress/types/net-stubbing';

describe('Tic Tac Toe Game', () => {
  beforeEach(() => {
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
      }).then((xhr) => {
        cy.interceptApi('GET', `/tic-tac-toe/game/${xhr.body.id}`).as('getGame');
        cy.interceptApi('POST', `/tic-tac-toe/game/${xhr.body.id}/move`).as('move');
        cy.visit(`/tic-tac-toe/games/${xhr.body.id}`);
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
      cy.get('[data-cy="game-pending"]').within(() => {
        cy.get('.left-button').click();
      });
      cy.get('[data-cy="game-rejected"]');
    });
  });

  function clickCell(cell: string): void {
    cy.get(`.cell.cell-${cell} .new-move-icon`).invoke('show').click();
    cy.wait('@move').its('response.statusCode').should('eq', 201);
  }
});
