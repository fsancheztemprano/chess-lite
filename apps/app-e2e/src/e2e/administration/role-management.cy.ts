describe('Role Management', () => {
  beforeEach(() => {
    cy.setState(1);
    cy.login('admin', '123456');
    cy.visit('/');
    cy.get('[data-cy="administration-tile"]').click();
    cy.get('[data-cy="role-management-tile"]').click();
  });

  it('should list all roles', () => {
    cy.get('[data-cy="role-item-ADMIN_ROLE"] > .cdk-column-name').should('contain', 'ADMIN_ROLE');
    cy.get('[data-cy="role-item-ADMIN_ROLE"] > .cdk-column-canLogin > .mat-icon').should('have.text', 'lock');
    cy.get('[data-cy="role-item-ADMIN_ROLE"] > .cdk-column-coreRole > .mat-icon').should('have.text', 'verified');
    cy.get('[data-cy="role-item-ADMIN_ROLE"] [data-cy="edit-role-button"]').should('exist');
    cy.get('[data-cy="role-item-ADMIN_ROLE"] [data-cy="delete-role-button"]').should('be.disabled');

    cy.get('[data-cy="role-item-MOD_ROLE"] > .cdk-column-name').should('contain', 'MOD_ROLE');
    cy.get('[data-cy="role-item-MOD_ROLE"] > .cdk-column-canLogin > .mat-icon').should('have.text', 'lock');
    cy.get('[data-cy="role-item-MOD_ROLE"] > .cdk-column-coreRole > .mat-icon').should('have.text', 'verified');
    cy.get('[data-cy="role-item-MOD_ROLE"] [data-cy="edit-role-button"]').should('exist');
    cy.get('[data-cy="role-item-MOD_ROLE"] [data-cy="delete-role-button"]').should('be.disabled');

    cy.get('[data-cy="role-item-SUPER_ADMIN_ROLE"] > .cdk-column-name').should('contain', 'SUPER_ADMIN_ROLE');
    cy.get('[data-cy="role-item-SUPER_ADMIN_ROLE"] > .cdk-column-canLogin > .mat-icon').should(
      'have.text',
      'lock_open',
    );
    cy.get('[data-cy="role-item-SUPER_ADMIN_ROLE"] > .cdk-column-coreRole > .mat-icon').should('have.text', 'verified');
    cy.get('[data-cy="role-item-SUPER_ADMIN_ROLE"] [data-cy="edit-role-button"]').should('exist');
    cy.get('[data-cy="role-item-SUPER_ADMIN_ROLE"] [data-cy="delete-role-button"]').should('be.disabled');

    cy.get('[data-cy="role-item-USER_ROLE"] > .cdk-column-name').should('contain', 'USER_ROLE');
    cy.get('[data-cy="role-item-USER_ROLE"] > .cdk-column-canLogin > .mat-icon').should('have.text', 'lock_open');
    cy.get('[data-cy="role-item-USER_ROLE"] > .cdk-column-coreRole > .mat-icon').should('have.text', 'verified');
    cy.get('[data-cy="role-item-USER_ROLE"] [data-cy="edit-role-button"]').should('exist');
    cy.get('[data-cy="role-item-USER_ROLE"] [data-cy="delete-role-button"]').should('be.disabled');
  });

  it('should create a new role', () => {
    cy.interceptApi('POST', '/role').as('createRole');
    cy.get('[data-cy="core-context-menu"]').click();
    cy.get('[data-cy="create-role-option"]').click();
    cy.get('[data-cy="accept-button"] button').should('be.disabled').should('contain.text', 'CREATE ROLE');
    cy.get('[data-cy="role-name-input"]').type('NEW_ROLE', { force: true });
    cy.get('[data-cy="role-name-input"]').clear().type('NEW_ROLE');
    cy.get('[data-cy="accept-button"] button').should('be.enabled');
    cy.get('[data-cy="accept-button"]').click();
    cy.wait('@createRole').then((xhr) => {
      expect(xhr.response?.statusCode).to.eq(200);
      expect(xhr.request?.body.name).to.eq('NEW_ROLE');
      cy.location('pathname').should('contain', `/administration/role-management/${xhr.response?.body?.id}`);
    });
    cy.get('#toast-container').should('contain', 'Role created successfully');
    cy.get('[data-cy="role-name"]').should('have.value', 'NEW_ROLE');
  });

  describe('Edit Role', () => {
    beforeEach(() => {
      cy.requestApi({
        method: 'POST',
        url: '/role',
        body: { name: 'NEW_TEST_ROLE' },
      });
      cy.interceptApi('PATCH', '/role/*').as('patchRole');
    });

    it('should delete a role', () => {
      cy.interceptApi('DELETE', '/role/*').as('deleteRole');

      cy.get('[data-cy="role-item-NEW_TEST_ROLE"] > .cdk-column-name').should('contain', 'NEW_TEST_ROLE');
      cy.get('[data-cy="role-item-NEW_TEST_ROLE"] [data-cy="delete-role-button"]').click();
      cy.get('[data-cy="dialog-accept-button"]').click();
      cy.wait('@deleteRole').then((interception) => {
        expect(interception.response?.statusCode).to.eq(204);
      });
      cy.get('#toast-container').should('contain', 'Role deleted successfully');
      cy.get('[data-cy="role-item-NEW_TEST_ROLE"]').should('not.exist');
    });

    it('should edit user role name', () => {
      cy.get('[data-cy="role-item-NEW_TEST_ROLE"] [data-cy="edit-role-button"]').click();
      cy.get('[data-cy="role-name"]').clear().type('NEW_TEST_ROLE_2');
      cy.get('[data-cy="save-role-name"]').click();
      cy.wait('@patchRole').then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body?.name).to.eq('NEW_TEST_ROLE_2');
      });
      cy.get('#toast-container').should('contain', 'Role updated successfully');
      cy.get('[data-cy="role-name"]').should('have.value', 'NEW_TEST_ROLE_2');
    });

    it('should edit role login access', () => {
      cy.get('[data-cy="role-item-NEW_TEST_ROLE"] [data-cy="edit-role-button"]').click();
      cy.get('[data-cy="NEW_TEST_ROLE-login-toggle"]').click();
      cy.wait('@patchRole').then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body?.canLogin).to.eq(true);
      });

      cy.get('[data-cy="NEW_TEST_ROLE-login-toggle"]').click();
      cy.wait('@patchRole').then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body?.canLogin).to.eq(false);
      });
    });

    it('should edit authorities', () => {
      cy.get('[data-cy="role-item-NEW_TEST_ROLE"] [data-cy="edit-role-button"]').click();
      cy.get('[data-cy="token:refresh"]').click();
      cy.get('[data-cy="save-role-authorities"]').click();
      cy.get('#toast-container').should('contain', 'Authorities updated successfully');
      cy.wait('@patchRole').then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body?.authorities).to.have.length(1);
        expect(interception.response?.body?.authorities[0].name).to.eq('token:refresh');
      });

      cy.get('[data-cy="token:refresh"]').click();
      cy.get('[data-cy="save-role-authorities"]').click();
      cy.get('#toast-container').should('contain', 'Authorities updated successfully');
      cy.wait('@patchRole').then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body?.authorities).to.be.empty;
      });
    });
  });
});
