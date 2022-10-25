describe('Service Logs Module', () => {
  beforeEach(() => {
    cy.setState(1).clearLocalStorage();
    cy.login('admin', '123456');
    cy.visit('/');
    cy.get('[data-cy="administration-tile"]').click();
    cy.get('[data-cy="service-logs-tile"]').click();
  });

  it('should display service logs', () => {
    cy.get('#mat-input-0').should('contain.value', '');
  });

  it('should delete service logs', () => {
    cy.get('#mat-input-0').should('contain.value', '');
    cy.get('[data-cy="core-context-menu"]').click();
    cy.get('[data-cy="delete-service-logs-option"]').click();
    cy.get('#mat-input-0').should('have.value', '');
  });

  afterEach(() => {
    cy.logout();
  });
});
