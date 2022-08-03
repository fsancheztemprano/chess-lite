describe('Application Load', () => {
  beforeEach(() => cy.visit('/app'));

  it('should display welcome message', () => {
    cy.get('.mat-drawer-inner-container > .mat-toolbar').should('contain', 'Welcome');
  });

  it('should display login tile', () => {
    cy.get('.tiled-menu-tile > .tiled-menu-tile-text-container > .tiled-menu-tile-title').should('contain', 'Login');
  });
});
