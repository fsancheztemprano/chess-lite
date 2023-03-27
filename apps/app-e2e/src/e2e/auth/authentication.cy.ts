describe('authentication', () => {
  beforeEach(() => {
    cy.setState(1).clearLocalStorage();
    cy.visit('/');
  });

  it('should login with admin user', () => {
    cy.get('app-home [data-cy="login-tile"]').click();
    cy.get('app-login [formControlName="username"]').type('admin');
    cy.get('app-login [formControlName="password"]').type('123456');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="nav-username"]').should('contain', 'admin');
    cy.get('app-home [data-cy="user-settings-tile"]').should('contain', 'User Settings');
    cy.get('app-home [data-cy="administration-tile"]').should('contain', 'Administration');
  });

  it('should login with bare user', () => {
    cy.get('app-home [data-cy="login-tile"]').click();
    cy.get('app-login [formControlName="username"]').type('e2e-user1');
    cy.get('app-login [formControlName="password"]').type('e2e-user1');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="nav-username"]').should('contain', 'e2e-user1');
    cy.get('app-home [data-cy="user-settings-tile"]').should('contain', 'User Settings');
    cy.get('app-home [data-cy="administration-tile"]').should('not.exist');
  });

  it('should not login with invalid credentials', () => {
    cy.get('app-home [data-cy="login-tile"]').click();
    cy.get('app-login [formControlName="username"]').type('invalid');
    cy.get('app-login [formControlName="password"]').type('invalid');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="nav-username"]').should('not.exist');
    cy.get('app-home [data-cy="user-settings-tile"]').should('not.exist');
    cy.get('app-home [data-cy="administration-tile"]').should('not.exist');
    cy.get('#toast-container').should('contain', 'Username / password incorrect');
  });

  it('should signup and login', () => {
    cy.interceptApi('POST', '/auth/signup').as('signup');
    cy.get('app-home [data-cy="signup-tile"]').click();
    cy.get('app-signup [formControlName="email"]').type('e2e-user4@localhost');
    cy.get('app-signup [formControlName="username"]').type('e2e-user4');
    cy.get('app-signup button[type="submit"]').click();
    cy.wait('@signup').then((xhr) => {
      expect(xhr.response?.statusCode).to.equal(204);
      expect(!!xhr.response?.body).to.be.false;
    });

    cy.login('admin', '123456');
    cy.requestApi({ method: 'GET', url: '/user' }).then((xhr) => {
      const newUserId = xhr.body?._embedded?.userModels?.find(
        (user: { username: string }) => user.username === 'e2e-user4',
      )?.id;
      cy.requestApi({
        method: 'PATCH',
        url: `/user/${newUserId}`,
        body: { locked: false, password: 'e2e-user4-password' },
      });
    });
    cy.logout();

    cy.get('[data-cy="login-menu-option"]').click();
    cy.get('app-login [formControlName="username"]').type('e2e-user4');
    cy.get('app-login [formControlName="password"]').type('e2e-user4-password');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="nav-username"]').should('contain', 'e2e-user4');
    cy.get('app-home [data-cy="user-settings-tile"]').should('contain', 'User Settings');
    cy.get('app-home [data-cy="administration-tile"]').should('not.exist');
  });
});
