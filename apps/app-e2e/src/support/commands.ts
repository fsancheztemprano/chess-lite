// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(username: string, password: string): Chainable<Subject>;

    logout(): Chainable<Subject>;

    setState(state: number): Chainable<Subject>;

    fakeLogin(user: AuthUser): Chainable<Subject>;
  }
}

Cypress.Commands.add('login', (username, password) => {
  return cy
    .request('POST', '/api/auth/login', {
      username,
      password,
    })
    .then((response) => {
      const token = response.headers['jwt-token'];
      console.log(response);
      console.log(response.headers);
      if (token) {
        if (typeof token === 'string') {
          localStorage.setItem('token', token);
        } else {
          localStorage.setItem('token', token[0]);
        }
      }
      const refreshToken = response.headers['jwt-refresh-token'];
      if (refreshToken) {
        if (typeof refreshToken === 'string') {
          localStorage.setItem('refreshToken', refreshToken);
        } else {
          localStorage.setItem('refreshToken', refreshToken[0]);
        }
      }
      return response;
    });
});

Cypress.Commands.add('logout', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  return cy;
});

Cypress.Commands.add('setState', (state: number) => {
  return cy.request('POST', `/api/cypress/STATE_${state}`);
});

Cypress.Commands.add('fakeLogin', (authUser: AuthUser = {}) => {
  localStorage.setItem('token', jwtToken(authUser));
  localStorage.setItem('refreshToken', jwtToken({ ...authUser, authorities: ['token:refresh'] }));
  return cy;
});

interface AuthUser {
  user?: {
    id?: string;
    username?: string;
  };
  authorities?: string[];
}

function jwtToken(authUser: AuthUser = {}): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const jwt = require('jsonwebtoken');

  const { user, authorities = [] } = authUser;
  const payload = {
    user: {
      id: user?.id || 'id',
      username: user?.username || 'username',
    },
    authorities,
  };
  return jwt.sign(payload, 'secret', {
    algorithm: 'HS512',
    issuer: 'api',
    audience: 'app',
    expiresIn: '2y',
    subject: payload.user.username,
  });
}
