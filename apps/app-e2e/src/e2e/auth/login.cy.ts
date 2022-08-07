import { CypressState } from '../../support/commands';

describe('Login', () => {
  beforeEach(() => {
    cy.setState(CypressState.STATE_1);
  });

  it('should login with admin user', () => {
    cy.visit('/');
    cy.get('app-home [data-cy="login-tile"]').click();
    cy.get('#mat-input-0').type('admin');
    cy.get('#mat-input-1').type('123456');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="nav-username"]').should('contain', 'admin');
  });

  afterEach(() => {
    cy.logout();
  });
});
