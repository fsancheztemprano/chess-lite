describe('Administration Home Component', () => {
  beforeEach(() => {
    cy.setState(1).clearLocalStorage();
    cy.login('admin', '123456');
    cy.visit('/administration');
  });

  it('should display administration side menu', () => {
    cy.get('[data-cy="administration-menu-item"]').should('contain', 'Administration').click();

    cy.get('[data-cy="administration-home-menu-item"]').should('contain', 'Dashboard');
    cy.get('[data-cy="user-management-menu-item"]').should('contain', 'User Management');
    cy.get('[data-cy="role-management-menu-item"]').should('contain', 'Role Management');
    cy.get('[data-cy="service-logs-menu-item"]').should('contain', 'Service Logs');
    cy.get('[data-cy="global-settings-menu-item"]').should('contain', 'Global Settings');
  });

  it('should display administration home tiles', () => {
    cy.get('[data-cy="user-management-tile"]').should('contain', 'User Management');
    cy.get('[data-cy="role-management-tile"]').should('contain', 'Role Management');
    cy.get('[data-cy="service-logs-tile"]').should('contain', 'Service Logs');
    cy.get('[data-cy="global-settings-tile"]').should('contain', 'Global Settings');
  });
});
