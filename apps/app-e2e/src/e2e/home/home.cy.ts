describe('Home Component', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('.mat-drawer-inner-container > .mat-toolbar').should('contain', 'Welcome');
  });

  it('should display login tile', () => {
    cy.get('app-home [data-cy="login-tile"]').should('contain', 'Login');
  });

  it('should display signup tile', () => {
    cy.get('app-home [data-cy="signup-tile"]').should('contain', 'Sign Up');
  });
});
