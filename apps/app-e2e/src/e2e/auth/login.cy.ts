describe('Login', () => {
  beforeEach(() => {
    cy.setState(1);
  });

  it('should login with admin user', () => {
    cy.visit('/');
    cy.get('app-home [data-cy="login-tile"]').click();
    cy.get('#mat-input-0').type('admin');
    cy.get('#mat-input-1').type('123456');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="nav-username"]').should('contain', 'admin');
    cy.get('app-home [data-cy="user-settings-tile"]').should('contain', 'User Settings');
    cy.get('app-home [data-cy="administration-tile"]').should('contain', 'Administration');
  });

  it('should login with bare user', () => {
    cy.visit('/');
    cy.get('app-home [data-cy="login-tile"]').click();
    cy.get('#mat-input-0').type('e2e-user1');
    cy.get('#mat-input-1').type('e2e-user1');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="nav-username"]').should('contain', 'e2e-user1');
    cy.get('app-home [data-cy="user-settings-tile"]').should('contain', 'User Settings');
    cy.get('app-home [data-cy="administration-tile"]').should('not.exist');
  });

  afterEach(() => {
    cy.logout();
  });
});
