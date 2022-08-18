describe('Home Component', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should display welcome message', () => {
    cy.get('.mat-drawer-inner-container > .mat-toolbar').should('contain', 'Welcome');
  });

  it('should display login tile', () => {
    cy.get('app-home [data-cy="login-tile"]').should('contain', 'Login');
  });

  it('should display signup tile', () => {
    cy.get('app-home [data-cy="signup-tile"]').should('contain', 'Sign Up');
  });

  it('should display user settings tile if user is logged in', () => {
    cy.login('e2e-user1', 'e2e-user1');
    cy.reload();
    cy.get('app-home [data-cy="user-settings-tile"]').should('contain', 'User Settings');
  });

  it('should display administration tile if user is admin', () => {
    cy.login('admin', '123456');
    cy.reload();
    cy.get('app-home [data-cy="administration-tile"]').should('contain', 'Administration');
  });
});
