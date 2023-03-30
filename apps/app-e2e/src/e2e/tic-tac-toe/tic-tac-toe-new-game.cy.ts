describe('Tic Tac Toe New Game', () => {
  beforeEach(() => {
    cy.setState(1).clearLocalStorage();
    cy.login('e2e-user1', 'e2e-user1');
    cy.visit('/tic-tac-toe/new-game');
  });

  it('should create a new game against user 2', () => {
    cy.interceptApi('POST', '/tic-tac-toe/game').as('createGame');
    cy.get('#formly_3_autocomplete_playerOUsername_1').type('e2e-user2');
    cy.get('#mat-option-0').click();
    cy.get('#formly_3_toggle_isPrivate_2-button').click();
    cy.get('[data-cy="new-game-button"]').click();
    cy.wait('@createGame').then((interception) => {
      expect(interception.request?.body.playerOUsername).to.eq('e2e-user2');
      expect(interception.request?.body.isPrivate).to.eq(true);
      expect(interception.response?.statusCode).to.eq(201);
    });

    cy.location('pathname').should('match', /\/tic-tac-toe\/games\//);
  });
});
