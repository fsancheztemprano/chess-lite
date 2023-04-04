describe('Tic Tac Toe Game List', () => {
  beforeEach(() => {
    cy.setState(2).clearLocalStorage();
  });

  it('list user and public games', () => {
    cy.login('e2e-user1', 'e2e-user1');
    cy.visit('/tic-tac-toe/games');

    cy.get('.mdc-data-table__content').children().should('have.length', 3);
    checkGameRow('e2e-user1', 'e2e-user4', true, 0);
    checkGameRow('e2e-user1', 'e2e-user3', false, 1);
    checkGameRow('e2e-user1', 'e2e-user2', false, 2);
  });

  it('list all games', () => {
    cy.login('admin', '123456');
    cy.visit('/tic-tac-toe/games');

    cy.get('.mdc-data-table__content').children().should('have.length', 4);
    checkGameRow('e2e-user2', 'e2e-user3', true, 0);
    checkGameRow('e2e-user1', 'e2e-user4', true, 1);
    checkGameRow('e2e-user1', 'e2e-user3', false, 2);
    checkGameRow('e2e-user1', 'e2e-user2', false, 3);
  });

  function checkGameRow(userX: string, userO: string, isPrivate: boolean, index: number) {
    cy.get('.mdc-data-table__content')
      .children()
      .eq(index)
      .within(() => {
        cy.get('.cdk-column-isPrivate > .mat-icon').should('contain', isPrivate ? 'lock' : 'public');
        cy.get('.cdk-column-playerX').should('contain', userX);
        cy.get('.cdk-column-playerO').should('contain', userO);
      });
  }
});
