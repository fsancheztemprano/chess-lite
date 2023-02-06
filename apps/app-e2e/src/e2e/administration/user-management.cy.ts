describe('User Management', () => {
  beforeEach(() => {
    cy.setState(1);
    cy.login('admin', '123456');
    cy.visit('/');
    cy.get('[data-cy="administration-tile"]').click();
    cy.get('[data-cy="user-management-tile"]').click();
  });

  it('should list all roles', () => {
    cy.get('[data-cy="user-list-tile"]').click();
    cy.get('[data-cy="user-item-admin"] > .cdk-column-username').should('contain', 'admin');
    cy.get('[data-cy="user-item-admin"] > .cdk-column-email').should('contain', 'admin@localhost');
    cy.get('[data-cy="user-item-admin"] > .cdk-column-role').should('contain', 'SUPER_ADMIN_ROLE');
    cy.get('[data-cy="user-item-admin"] > .cdk-column-active [type="checkbox"]').should('be.checked');
    cy.get('[data-cy="user-item-admin"] > .cdk-column-locked [type="checkbox"]').should('not.be.checked');
    cy.get('[data-cy="user-item-admin"] > .cdk-column-edit a').should('exist');

    cy.get('[data-cy="user-item-e2e-user1"] > .cdk-column-username').should('contain', 'e2e-user1');
    cy.get('[data-cy="user-item-e2e-user1"] > .cdk-column-email').should('contain', 'e2e-user1@localhost');
    cy.get('[data-cy="user-item-e2e-user1"] > .cdk-column-role').should('contain', 'USER_ROLE');
    cy.get('[data-cy="user-item-e2e-user1"] > .cdk-column-active [type="checkbox"]').should('be.checked');
    cy.get('[data-cy="user-item-e2e-user1"] > .cdk-column-locked [type="checkbox"]').should('not.be.checked');
    cy.get('[data-cy="user-item-e2e-user1"] > .cdk-column-edit a').should('exist');
  });

  it('should create a new user', () => {
    cy.interceptApi('POST', '/user').as('createUser');

    cy.get('[data-cy="new-user-tile"]').click();

    cy.get('app-user-management-create [formControlName="username"]').type('e2e-user2');
    cy.get('app-user-management-create [formControlName="email"]').type('e2e-user2@localhost');
    cy.get('app-user-management-create [formControlName="firstname"]').type('e2e-user2-firstname');
    cy.get('app-user-management-create [formControlName="lastname"]').type('e2e-user2-lastname');
    cy.get('app-user-management-create [formControlName="profileImageUrl"]').type('e2e-user2-avatar');

    cy.get('app-user-management-create [formControlName="roleId"]').click();
    cy.get('[data-cy="USER_ROLE-option"]').click();

    cy.get('app-user-management-create [formControlName="password"]').type('e2e-user2-password');
    cy.get('app-user-management-create [formControlName="password2"]').type('e2e-user2-password');
    cy.get('app-user-management-create [formControlName="active"] [type="checkbox"]').check({ force: true });
    cy.get('app-user-management-create [formControlName="locked"] [type="checkbox"]').should('be.enabled');
    cy.get('app-user-management-create [formControlName="expired"] [type="checkbox"]').should('be.enabled');
    cy.get('app-user-management-create [formControlName="credentialsExpired"] [type="checkbox"]').should('be.enabled');

    cy.get('app-user-management-create button[type="submit"]').click();
    cy.wait('@createUser').then((xhr) => {
      expect(xhr.response?.statusCode).to.eq(201);
      expect(!!xhr.response?.body.id).to.be.true;
      cy.location('pathname').should(
        'contain',
        `/administration/user-management/users/${xhr.response?.body?.id}/profile`,
      );
    });

    cy.logout();
    cy.login('e2e-user2', 'e2e-user2-password');
    cy.reload();
    cy.get('[data-cy="nav-username"]').should('contain', 'e2e-user2');
  });

  describe('edit user', () => {
    beforeEach(() => {
      cy.request({
        method: 'POST',
        url: Cypress.env('apiUrl') + '/auth/signup',
        body: { username: 'e2e-user3', email: 'e2e-user3@localhost' },
      });
      cy.get('[data-cy="user-list-tile"]').click();
      cy.get('[data-cy="user-item-e2e-user3"] > .cdk-column-edit a').click();
    });

    it('should edit profile', () => {
      cy.interceptApi('PATCH', '/user/*').as('updateUser');
      cy.get('[data-cy="user-detail-tab"]').click();
      cy.get('app-user-management-profile [formControlName="firstname"]').clear().type('e2e-user3-firstname2');
      cy.get('app-user-management-profile [formControlName="lastname"]').clear().type('e2e-user3-lastname2');
      cy.get('app-user-management-profile [formControlName="locked"] [type="checkbox"]').uncheck({ force: true });
      cy.get('app-user-management-profile button[type="submit"]').click();
      cy.wait('@updateUser').then((xhr) => {
        expect(xhr.response?.statusCode).to.eq(200);
        expect(!!xhr.response?.body.id).to.be.true;
        expect(xhr.response?.body.firstname).equal('e2e-user3-firstname2');
        expect(xhr.response?.body.lastname).equal('e2e-user3-lastname2');
        expect(xhr.response?.body.locked).equal(false);
      });
    });

    it('should edit users preferences', () => {
      cy.interceptApi('PATCH', '/user/preferences/*').as('updateUser');
      cy.interceptApi('GET', '/user/preferences/*').as('getUserPreferences');
      cy.get('[data-cy="user-preferences-tab"]').click();
      cy.wait('@getUserPreferences');

      cy.get('app-user-management-preferences [formControlName="contentLanguage"]').click();
      cy.get('[data-cy="es-option"]').click();

      cy.get('app-user-management-preferences [formControlName="darkMode"] .mdc-switch--unselected').should('exist');
      cy.get('app-user-management-preferences [formControlName="darkMode"]').click();
      cy.get('app-user-management-preferences [formControlName="darkMode"] .mdc-switch--selected').should('exist');

      cy.get('app-user-management-preferences button[type="submit"]').click();
      cy.wait('@updateUser').then((xhr) => {
        expect(xhr.request?.body.darkMode).equal(true);
        expect(xhr.request?.body.contentLanguage).equal('es');
        expect(xhr.response?.statusCode).to.eq(200);
        expect(xhr.response?.body.darkMode).equal(true);
        expect(xhr.response?.body.contentLanguage).equal('es');
      });
    });

    it('should edit user role', () => {
      cy.interceptApi('PATCH', '/user/*/role').as('updateUserRole');
      cy.get('[data-cy="user-authorities-tab"]').click();

      cy.get('app-user-management-role [formControlName="roleId"]').click();
      cy.get('[data-cy="MOD_ROLE-option"]').click();

      cy.get('app-user-management-role button').click();
      cy.wait('@updateUserRole').then((xhr) => {
        expect(xhr.response?.statusCode).to.eq(200);
        expect(!!xhr.response?.body.id).to.be.true;
        expect(xhr.response?.body.role.name).equal('MOD_ROLE');
      });
    });

    it('should edit user authorities', () => {
      cy.interceptApi('PATCH', '/user/*/authorities').as('updateUserAuthorities');
      cy.get('[data-cy="user-authorities-tab"]').click();

      cy.get('app-user-management-role [formControlName="roleId"]').click();
      cy.get('[data-cy="MOD_ROLE-option"]').click();

      cy.get('app-user-management-authorities [data-cy="token:refresh-toggle"] [type="checkbox"]').should('be.checked');
      cy.get('app-user-management-authorities [data-cy="profile:update-toggle"] [type="checkbox"]').should(
        'be.checked',
      );
      cy.get('app-user-management-authorities [data-cy="profile:read-toggle"] [type="checkbox"]').should('be.checked');
      cy.get('app-user-management-authorities [data-cy="profile:delete-toggle"] [type="checkbox"]').should(
        'be.checked',
      );
      cy.get('app-user-management-authorities [data-cy="user:read-toggle"] [type="checkbox"]').should('not.be.checked');

      cy.get('app-user-management-authorities [data-cy="profile:delete-toggle"] [type="checkbox"]').click();
      cy.get('app-user-management-authorities [data-cy="user:read-toggle"] [type="checkbox"]').click();

      cy.get('app-user-management-authorities button').click();
      cy.wait('@updateUserAuthorities').then((xhr) => {
        expect(xhr.response?.statusCode).to.eq(200);
        expect(!!xhr.response?.body.id).to.be.true;
        expect(xhr.response?.body.authorities).to.have.length(4);
        expect(
          (xhr.response?.body.authorities as []).map((authority: { name: string }) => authority.name),
        ).contains.all.members(['token:refresh', 'profile:update', 'profile:read', 'user:read']);
      });
    });

    it('should change user password', () => {
      cy.interceptApi('PATCH', '/user/*').as('updateUser');
      cy.get('[data-cy="user-account-tab"]').click();
      cy.get('app-user-management-account-password [formControlName="password"]').type('e2e-user3-password');
      cy.get('app-user-management-account-password [formControlName="password2"]').type('e2e-user3-password');
      cy.get('app-user-management-account-password button[type="submit"]').click();
      cy.wait('@updateUser').then((xhr) => {
        expect(xhr.response?.statusCode).to.eq(200);
        expect(!!xhr.response?.body.id).to.be.true;
      });
    });

    it('should delete account', () => {
      cy.interceptApi('DELETE', '/user/*').as('deleteUser');
      cy.get('[data-cy="user-account-tab"]').click();
      cy.get('app-user-management-account-delete button').click();

      cy.get('[data-cy="username-removal-confirmation"]').type('e2e-user3');
      cy.get('[data-cy="remove-user-button"]').click();

      cy.wait('@deleteUser').then((xhr) => {
        expect(xhr.response?.statusCode).to.eq(204);
        expect(!!xhr.response?.body).to.be.false;
      });
    });
  });
});
