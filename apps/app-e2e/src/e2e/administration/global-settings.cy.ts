describe('Global Settings Module', () => {
  beforeEach(() => {
    cy.interceptApi('PATCH', '/role/*').as('patchRoleAccess');
    cy.interceptApi('PATCH', '/global-settings').as('patchGlobalSettings');
    cy.setState(1);
    cy.login('admin', '123456');
    cy.visit('/');
    cy.get('[data-cy="administration-tile"]').click();
    cy.get('[data-cy="global-settings-tile"]').click();
  });

  it('should change default role', () => {
    cy.get('#mat-select-value-1').should('contain', 'USER_ROLE').click();
    cy.get('#mat-option-1').should('contain', 'MOD_ROLE').click();
    cy.get('button[data-cy="update-default-role"]').click();
    cy.wait('@patchGlobalSettings').then((interception) => {
      expect(interception.request?.body.defaultRoleId).not.to.eq(undefined);
      expect(interception.request?.body.signupOpen).to.eq(undefined);
      expect(interception.response?.statusCode).to.eq(200);
    });
  });

  it('should toggle signup open', () => {
    cy.get('[data-cy="toggle-signup"]').click();
    cy.wait('@patchGlobalSettings').then((interception) => {
      expect(interception.request?.body.defaultRoleId).to.eq(undefined);
      expect(interception.request?.body.signupOpen).to.eq(false);
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body.signupOpen).to.eq(false);
    });
    cy.get('[data-cy="toggle-signup"]').click();
    cy.wait('@patchGlobalSettings').then((interception) => {
      expect(interception.request?.body.defaultRoleId).to.eq(undefined);
      expect(interception.request?.body.signupOpen).to.eq(true);
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body.signupOpen).to.eq(true);
    });
  });

  it('should enable access to a role', () => {
    Cypress.on('uncaught:exception', (err: Error) => !err.message.includes('ResizeObserver loop limit exceeded'));
    cy.get('[data-cy="global-settings-access-restrictions-tab"]').click();
    cy.get('[data-cy="MOD_ROLE-login-toggle"]').click();
    cy.wait('@patchRoleAccess').then((interception) => {
      expect(interception.request?.body.canLogin).to.eq(true);
      expect(interception.response?.statusCode).to.eq(200);
    });
  });

  it('should disable access to a role', () => {
    Cypress.on('uncaught:exception', (err: Error) => !err.message.includes('ResizeObserver loop limit exceeded'));
    cy.get('[data-cy="global-settings-access-restrictions-tab"]').click();
    cy.get('[data-cy="USER_ROLE-login-toggle"]').click();
    cy.wait('@patchRoleAccess').then((interception) => {
      expect(interception.request?.body.canLogin).to.eq(false);
      expect(interception.response?.statusCode).to.eq(200);
    });
  });
});
