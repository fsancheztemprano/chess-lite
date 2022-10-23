// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { version } from '../../../../../package.json';

describe('Build Info', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.setState(0);
    cy.visit('/');
  });

  it('should display build info version', () => {
    cy.get('[data-cy="build-info"]').click();
    cy.get('.version').should('contain', version);
  });
});
