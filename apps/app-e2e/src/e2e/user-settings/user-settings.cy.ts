describe('User Settings Module >', () => {
  beforeEach(() => {
    cy.setState(1).clearLocalStorage();
    cy.login('e2e-user1', 'e2e-user1');
    cy.visit('/');
    cy.get('app-home [data-cy="user-settings-tile"]').click();
  });

  it('should display user settings side menu', () => {
    cy.get('[data-cy="user-settings-menu-item"] a').should('contain', 'User Settings').click({ force: true });

    cy.get('[data-cy="user-settings-home-menu-item"]').should('contain', 'Dashboard');
    cy.get('[data-cy="user-profile-menu-item"]').should('contain', 'Profile');
    cy.get('[data-cy="user-avatar-menu-item"]').should('contain', 'Upload Avatar');
    cy.get('[data-cy="user-password-menu-item"]').should('contain', 'Change Password');
    cy.get('[data-cy="user-delete-menu-item"]').should('contain', 'Delete Account');
    cy.get('[data-cy="user-preferences-menu-item"]').should('contain', 'Preferences');
  });

  it('should display user settings home tiles', () => {
    cy.get('[data-cy="user-profile-tile"]').should('contain', 'User Profile');
    cy.get('[data-cy="user-avatar-tile"]').should('contain', 'Upload Avatar');
    cy.get('[data-cy="user-password-tile"]').should('contain', 'Change Password');
    cy.get('[data-cy="user-remove-tile"]').should('contain', 'Delete Account');
    cy.get('[data-cy="user-preferences-tile"]').should('contain', 'Account Preferences');
  });

  it('should edit user profile', () => {
    cy.interceptApi('PATCH', '/user/profile').as('updateProfile');
    cy.get('[data-cy="user-profile-tile"]').click();
    cy.get('#mat-input-0').should('have.value', 'e2e-user1');
    cy.get('#mat-input-1').should('have.value', 'e2e-user1@localhost');
    cy.get('#mat-input-2').should('have.value', '');
    cy.get('#mat-input-2').type('new username');
    cy.get('#mat-input-3').should('have.value', '');
    cy.get('#mat-input-3').type('new last name');
    cy.get('[data-cy="update-profile-button"]').click();
    cy.wait('@updateProfile').its('response.statusCode').should('eq', 200);
    cy.get('#toast-container').should('contain', 'User Profile Saved Successfully.');
    cy.get('[data-cy="nav-username"]').should('contain', 'new username');
  });

  it('should upload user avatar', () => {
    cy.interceptApi('PATCH', '/user/profile/avatar').as('updateAvatar');
    cy.get('[data-cy="user-avatar-tile"]').click();
    cy.get('.mat-card-content > .mat-icon').should('contain', 'person_outline');

    cy.get('input[type="file"]').selectFile(
      {
        fileName: 'users.jpg',
        contents: [{ name: 'John Doe' }],
      },
      { force: true },
    );
    cy.wait('@updateAvatar').its('response.statusCode').should('eq', 200);

    cy.get('img[alt="Avatar"]').should('exist');
  });

  it('should change user password', () => {
    cy.interceptApi('PATCH', '/user/profile/password').as('updatePassword');
    cy.get('[data-cy="user-password-tile"]').click();
    cy.get('#mat-input-0').type('e2e-user1');
    cy.get('#mat-input-1').type('e2e-user1');
    cy.get('#mat-input-2').type('e2e-user1-new');
    cy.get('#mat-input-3').type('e2e-user1-new');

    cy.get('[data-cy="change-password-button"]').click();
    cy.wait('@updatePassword').its('response.statusCode').should('eq', 200);
    cy.get('#toast-container').should('contain', 'Password changed successfully');
    cy.get('[data-cy="logout-menu-option"]').click();
    cy.get('app-home [data-cy="login-tile"]').click();
    cy.get('#mat-input-4').type('e2e-user1');
    cy.get('#mat-input-5').type('e2e-user1-new');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="nav-username"]').should('contain', 'e2e-user1');
  });

  it('should remove account', () => {
    cy.interceptApi('DELETE', '/user/profile').as('deleteAccount');
    cy.get('[data-cy="user-remove-tile"]').click();
    cy.get('[data-cy="remove-account-button"]').click();
    cy.get('#mat-input-0').type('e2e-user1');
    cy.get('[data-cy="password-confirm-button"]').click();
    cy.wait('@deleteAccount').its('response.statusCode').should('eq', 204);
    cy.get('#toast-container').should('contain', 'Account and all associated data was removed.');
    cy.get('[data-cy="login-menu-option"]').should('exist');
  });

  it('should change user preferences', () => {
    cy.interceptApi('PATCH', '/user/profile/preferences').as('updateProfilePreferences');
    cy.get('[data-cy="user-preferences-tile"]').click();
    cy.get('[data-cy="preferences-dark-toggle"]').click();
    cy.get('#mat-select-value-1').click();
    cy.get('mat-option').contains('Spanish').click();
    cy.get('[data-cy="change-preferences-button"]').click();
    cy.wait('@updateProfilePreferences').its('response.statusCode').should('eq', 200);
    cy.get('[data-cy="change-preferences-button"]').should('contain', 'Guardar y Aplicar');
  });
});
