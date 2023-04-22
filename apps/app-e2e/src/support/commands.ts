import RequestOptions = Cypress.RequestOptions;

// eslint-disable-next-line @typescript-eslint/no-namespace,@typescript-eslint/no-unused-vars
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(username: string, password: string): Chainable<Subject>;

    logout(): Chainable<Subject>;

    setState(state: number): Chainable<Subject>;

    fakeLogin(user: AuthUser): Chainable<Subject>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestApi<T = any>(options?: Partial<RequestOptions>): Chainable<Response<T>>;

    interceptApi(method?: string, url?: string): Chainable<Subject>;
  }
}

interface AuthUser {
  user?: {
    id?: string;
    username?: string;
  };
  authorities?: string[];
}

Cypress.Commands.add('login', (username: string, password: string) =>
  cy
    .clearLocalStorage()
    .requestApi({
      method: 'POST',
      url: '/auth/login',
      body: {
        username,
        password,
      },
    })
    .then((response) => {
      const token = response.headers['jwt-token'];
      if (token) {
        if (typeof token === 'string') {
          window.localStorage.setItem('token', token);
        } else {
          window.localStorage.setItem('token', token[0]);
        }
      }
      const refreshToken = response.headers['jwt-refresh-token'];
      if (refreshToken) {
        if (typeof refreshToken === 'string') {
          window.localStorage.setItem('refreshToken', refreshToken);
        } else {
          window.localStorage.setItem('refreshToken', refreshToken[0]);
        }
      }
      return response;
    }),
);

Cypress.Commands.add('logout', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  return cy.clearLocalStorage();
});

Cypress.Commands.add('setState', (state: number) =>
  cy.request('POST', `${Cypress.env('apiUrl')}/cypress/STATE_${state}`),
);

Cypress.Commands.add('fakeLogin', (authUser: AuthUser = {}) => {
  localStorage.setItem('token', jwtToken(authUser));
  localStorage.setItem('refreshToken', jwtToken({ ...authUser, authorities: ['token:refresh'] }));
  return cy;
});

Cypress.Commands.add('requestApi', (options?: Partial<RequestOptions>) => {
  const token = localStorage.getItem('token');
  return cy.request({
    ...options,
    url: Cypress.env('apiUrl') + options?.url || '',
    headers: { ...options?.headers, Authorization: token ? `Bearer ${token}` : undefined },
  });
});

Cypress.Commands.add('interceptApi', (method = 'GET', url = '') => cy.intercept(method, Cypress.env('apiUrl') + url));

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

interface AuthUser {
  user?: {
    id?: string;
    username?: string;
  };
  authorities?: string[];
}
