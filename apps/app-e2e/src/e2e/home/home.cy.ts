describe('Home Component', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.setState(1);
    cy.visit('/');
  });

  it('should display welcome message', () => {
    cy.get('.mat-drawer-inner-container > .mat-toolbar').should('contain', 'Welcome');
  });

  it('should display login tile', () => {
    cy.get('app-home [data-cy="login-tile"]').should('contain', 'Login').click();
    cy.location('pathname').should('match', /\/auth\/login$/);
  });

  it('should display signup tile', () => {
    cy.get('app-home [data-cy="signup-tile"]').should('contain', 'Sign Up').click();
    cy.location('pathname').should('match', /\/auth\/signup$/);
  });

  it('should display user settings tile if user is logged in', () => {
    cy.login('e2e-user1', 'e2e-user1');
    cy.reload();
    cy.get('app-home [data-cy="user-settings-tile"]').should('contain', 'User Settings').click();
    cy.location('pathname').should('match', /\/user$/);
  });

  it('should display administration tile if user is admin', () => {
    cy.login('admin', '123456');
    cy.reload();
    cy.get('app-home [data-cy="administration-tile"]').should('contain', 'Administration').click();
    cy.location('pathname').should('match', /\/administration$/);
  });

  it('should display tic-tac-toe tile if user is logged in', () => {
    cy.login('e2e-user1', 'e2e-user1');
    cy.reload();
    cy.get('app-home [data-cy="tic-tac-toe-tile"]').should('contain', 'Tic Tac Toe').click();
    cy.location('pathname').should('match', /\/tic-tac-toe$/);
  });
});
