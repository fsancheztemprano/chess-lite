describe('Tic Tac Toe Home Component', () => {
  beforeEach(() => {
    cy.setState(1).clearLocalStorage();
    cy.login('admin', '123456');
    cy.visit('/');
    cy.get('[data-cy="tic-tac-toe-tile"]').click();
  });

  it('should display tic tac toe side menu', () => {
    cy.get('[data-cy="tic-tac-toe-menu-option"]').should('contain', 'Tic Tac Toe').click();
    cy.location('pathname').should('match', /\/tic-tac-toe$/);
  });

  it('should display tic tac toe game list tile', () => {
    cy.get('[data-cy="tic-tac-toe-games-tile"]').should('contain', 'Game List').click();
    cy.location('pathname').should('match', /\/tic-tac-toe\/games$/);
  });

  it('should display tic tac toe new game tile', () => {
    cy.get('[data-cy="tic-tac-toe-new-game-tile"]').should('contain', 'New Game').click();
    cy.location('pathname').should('match', /\/tic-tac-toe\/new-game$/);
  });

  it('should show notifications sidebar', () => {
    cy.get('app-sidebar-button > button').click();
    cy.get('#formly_2_toggle_myTurns_0').should('contain', 'My Turns');
    cy.get('#formly_2_toggle_newGames_1').should('contain', 'New Games');
  });
});
