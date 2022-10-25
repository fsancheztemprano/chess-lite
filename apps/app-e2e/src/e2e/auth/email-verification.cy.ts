// import { filter, first, firstValueFrom, map, takeUntil, timer } from 'rxjs';
//
// describe.skip('email verification', { defaultCommandTimeout: 60000 }, () => {
//   beforeEach(() => {
//     cy.setState(1).clearLocalStorage();
//     cy.request('DELETE', Cypress.env('emailUrl') + '/api/v1/messages');
//     cy.visit('/');
//   });
//
//   it('should signup activate account and login', () => {
//     cy.interceptApi('POST', '/auth/signup').as('signup');
//     cy.get('[data-cy="signup-tile"]').click();
//     cy.get('app-signup [formControlName="email"]').type('e2e-user5@localhost');
//     cy.get('app-signup [formControlName="username"]').type('e2e-user5');
//     cy.get('app-signup button[type="submit"]').click();
//     cy.wait('@signup').then((xhr) => {
//       expect(xhr.response?.statusCode).to.equal(204);
//     });
//
//     // Get first published email, fails if previous tests sent mails asynchronously
//     //
//     // cy.streamRequest<{ Content: { Body: string } }>(config, { streamTimeout: 15000 }).then(
//     //   (results: void | Array<{ Content: { Body: string } }>) => {
//     //     expect(!!results).to.be.true;
//     //     expect(results).to.have.length(1);
//     //     expect(Array.isArray(results)).to.be.true;
//     //     const activationUrl = (results as Array<{ Content: { Body: string } }>)[0].Content.Body.split('"')[1];
//     //     expect(activationUrl).to.contain('e2e-user5@localhost');
//     //     cy.visit(activationUrl);
//     //   },
//     // );
//
//     cy.stream<{ Content: { Body: string } }>(Cypress.env('emailUrl').replace('http', 'ws') + '/api/v2/websocket')
//       .then((subject) => {
//         return firstValueFrom(
//           subject.pipe(
//             takeUntil(timer(60000)),
//             filter((message) => message?.Content?.Body?.includes('e2e-user5@localhost')),
//             first(),
//             map((message) => message.Content.Body.split('"')[1]),
//           ),
//         );
//       })
//       .then((activationUrl) => cy.visit(activationUrl));
//
//     activateAccount('e2e-user5-password');
//     login('e2e-user5', 'e2e-user5-password');
//   });
//
//   it('should request activation token, activate account and login', () => {
//     cy.interceptApi('POST', '/auth/token').as('activationToken');
//     cy.get('[data-cy="login-tile"]').click();
//     cy.get('app-login [data-cy="account-recovery"]').click();
//     cy.get('app-token-request [formControlName="email"]').type('e2e-user1@localhost');
//     cy.get('app-token-request button[type="submit"]').click();
//     cy.wait('@activationToken').then((xhr) => {
//       expect(xhr.response?.statusCode).to.equal(204);
//     });
//
//     // Iframe is pulling a Gandalf
//     // cy.origin(Cypress.env('emailUrl'), () => {
//     //   cy.visit('/');
//     //   cy.get('.subject').contains('e2e-user1 Welcome. Here is your Activation Token').click();
//     //
//     //   cy.get('iframe#preview-html')
//     //     .its('0.contentDocument')
//     //     .should('exist')
//     //     .its('body')
//     //     .should('not.be.undefined')
//     //     .then(cy.wrap)
//     //     .then((body) => {
//     //       cy.log(JSON.stringify(body));
//     //     });
//     //   cy.contains('Click Here').click({ force: true });
//     // });
//
//     cy.stream<{ Content: { Body: string } }>(Cypress.env('emailUrl').replace('http', 'ws') + '/api/v2/websocket')
//       .then((subject) => {
//         return firstValueFrom(
//           subject.pipe(
//             takeUntil(timer(60000)),
//             filter((message) => message?.Content?.Body?.includes('e2e-user1@localhost')),
//             first(),
//             map((message) => message.Content.Body.split('"')[1]),
//           ),
//         );
//       })
//       .then((activationUrl) => cy.visit(activationUrl));
//
//     activateAccount('e2e-user1-password2');
//     login('e2e-user1', 'e2e-user1-password2');
//   });
//
//   function login(username: string, password: string) {
//     cy.get('app-login [formControlName="username"]').type(username);
//     cy.get('app-login [formControlName="password"]').type(password);
//     cy.get('[data-cy="login-button"]').click();
//     cy.get('[data-cy="nav-username"]').should('contain', username);
//     cy.get('app-home [data-cy="user-settings-tile"]').should('contain', 'User Settings');
//   }
//
//   function activateAccount(password: string) {
//     cy.get('app-account-activation [formControlName="password"]').type(password);
//     cy.get('app-account-activation [formControlName="password2"]').type(password);
//     cy.get('app-account-activation button[type="submit"]').click();
//   }
// });
