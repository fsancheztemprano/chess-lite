import { WebSocketSubjectConfig } from 'rxjs/internal/observable/dom/WebSocketSubject';

describe('email verification', () => {
  beforeEach(() => {
    cy.setState(1).clearLocalStorage();
    cy.request('DELETE', Cypress.env('emailUrl') + '/api/v1/messages');
    cy.visit('/');
  });

  const config: WebSocketSubjectConfig<{ Content: { Body: string } }> = {
    url: Cypress.env('emailUrl').replace('http', 'ws') + '/api/v2/websocket',
  };

  it('should signup activate account and login', () => {
    cy.interceptApi('POST', '/auth/signup').as('signup');
    cy.get('[data-cy="signup-tile"]').click();
    cy.get('app-signup [formControlName="email"]').type('e2e-user5@localhost');
    cy.get('app-signup [formControlName="username"]').type('e2e-user5');
    cy.get('app-signup button[type="submit"]').click();
    cy.wait('@signup').then((xhr) => {
      expect(xhr.response?.statusCode).to.equal(204);
    });

    cy.streamRequest<{ Content: { Body: string } }>(config, { streamTimeout: 15000 }).then(
      (results: void | Array<{ Content: { Body: string } }>) => {
        expect(!!results).to.be.true;
        expect(results).to.have.length(1);
        expect(Array.isArray(results)).to.be.true;
        const activationUrl = (results as Array<{ Content: { Body: string } }>)[0].Content.Body.split('"')[1];
        expect(activationUrl).to.contain('e2e-user5@localhost');
        cy.visit(activationUrl);
      },
    );

    activateAccount('e2e-user5-password');
    login('e2e-user5', 'e2e-user5-password');
  });

  it('should request activation token, activate account and login', () => {
    cy.interceptApi('POST', '/auth/token').as('activationToken');
    cy.get('[data-cy="login-tile"]').click();
    cy.get('app-login [data-cy="account-recovery"]').click();
    cy.get('app-token-request [formControlName="email"]').type('e2e-user1@localhost');
    cy.get('app-token-request button[type="submit"]').click();
    cy.wait('@activationToken').then((xhr) => {
      expect(xhr.response?.statusCode).to.equal(204);
    });

    cy.streamRequest<{ Content: { Body: string } }>(config, { streamTimeout: 15000 }).then(
      (results: void | Array<{ Content: { Body: string } }>) => {
        expect(!!results).to.be.true;
        expect(results).to.have.length(1);
        expect(Array.isArray(results)).to.be.true;
        const activationUrl = (results as Array<{ Content: { Body: string } }>)[0].Content.Body.split('"')[1];
        expect(activationUrl).to.contain('e2e-user1@localhost');
        cy.visit(activationUrl);
      },
    );

    // cy.origin(Cypress.env('emailUrl'), () => {
    //   cy.visit('/');
    //   cy.get('.subject').contains('Your App Account Activation Token').click();
    // cy.contains('Click Here')
    //   .should('have.attr', 'href')
    //   .then((href) => {
    //     cy.log(String(href));
    //   });
    // .click({ force: true });
    // cy.get('#preview-html', { timeout: 10000 }).then(($iframe) => {
    //   cy.wait(10000);
    // cy.wrap($iframe.contents().find('a'));

    // .click({ force: true });
    // });
    //   }
    //     // .its('0.contentDocument').should('contain', 'Your App Account Activation Token');
    //     .within((a) => {
    //       // cy.get('a').contains('Click Here').click();
    //       console.log(a);
    //       cy.log(String(a));
    //     });
    // });

    activateAccount('e2e-user1-password2');
    login('e2e-user1', 'e2e-user1-password2');
  });

  function login(username: string, password: string) {
    cy.get('app-login [formControlName="username"]').type(username);
    cy.get('app-login [formControlName="password"]').type(password);
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="nav-username"]').should('contain', username);
    cy.get('app-home [data-cy="user-settings-tile"]').should('contain', 'User Settings');
  }

  function activateAccount(password: string) {
    cy.get('app-account-activation [formControlName="password"]').type(password);
    cy.get('app-account-activation [formControlName="password2"]').type(password);
    cy.get('app-account-activation button[type="submit"]').click();
  }
});
