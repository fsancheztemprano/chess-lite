describe('Theme Administration', () => {
  beforeEach(() => {
    cy.interceptApi('GET', '/theme').as('getTheme');
    cy.interceptApi('PATCH', '/theme').as('updateTheme');
    cy.setState(1);
    cy.login('admin', '123456');
    cy.visit('/');
    cy.get('[data-cy="administration-tile"]').click();
    cy.get('[data-cy="theme-tile"]').click();
    cy.wait('@getTheme');
  });

  it('should load theme pickers', () => {
    cy.get('#mat-input-0').should('have.value', '#303f9f');
    cy.get('#mat-input-1').should('have.value', '#f9a825');
    cy.get('#mat-input-2').should('have.value', '#c2185b');
  });

  it('should set primary color', () => {
    cy.get('.primary-picker .app-color-picker .circle').click();
    cy.get('.manual-input-wrapper input').invoke('val', '#44f92').trigger('change').trigger('keydown');
    cy.get('.manual-input-wrapper input').type('5');
    cy.wait('@updateTheme').then((interception) => {
      expect(interception.request?.body.primaryColor).to.eq('#44f925');
      expect(interception.response?.statusCode).to.eq(200);
    });
  });

  it('should clear accent color', () => {
    cy.get('.accent-picker button').click();
    cy.wait('@updateTheme').then((interception) => {
      expect(interception.request?.body.accentColor).to.eq(null);
      expect(interception.response?.statusCode).to.eq(200);
    });
  });
});
