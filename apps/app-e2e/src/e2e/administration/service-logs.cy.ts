describe('Service Logs Module', () => {
  beforeEach(() => {
    cy.setState(1).clearLocalStorage();
    cy.login('admin', '123456');
    cy.visit('/administration/service-logs');
  });

  it('should display service logs', () => {
    cy.get('#mat-input-0').should('contain.value', 'Cypress State: STATE_1');
  });

  it('should delete service logs', () => {
    cy.get('#mat-input-0').should('contain.value', 'Cypress State: STATE_1');
    cy.get('[data-cy="core-context-menu"]').click();
    cy.get('[data-cy="delete-service-logs-option"]').click();
    cy.get('#mat-input-0').should('have.value', '');
  });

  afterEach(() => {
    cy.logout();
    cy.wait(1000);
  });
});
