describe('Theme Initialization', () => {
  beforeEach(() => {
    cy.setState(1);
    cy.visit('/');
  });

  it('should initialize with theme colors', () => {
    cy.get('app-toolbar > .mat-toolbar').should('have.css', 'background-color', 'rgb(48, 63, 159)');

    cy.document()
      .then((doc) => window.getComputedStyle(doc.documentElement).getPropertyValue('--primary-500'))
      .should('eq', '#303f9f');
    cy.document()
      .then((doc) => window.getComputedStyle(doc.documentElement).getPropertyValue('--accent-500'))
      .should('eq', '#f9a825');
    cy.document()
      .then((doc) => window.getComputedStyle(doc.documentElement).getPropertyValue('--warn-500'))
      .should('eq', '#c2185b');
  });
});
