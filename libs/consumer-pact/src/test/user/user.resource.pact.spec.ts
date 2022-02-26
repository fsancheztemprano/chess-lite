import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TOKEN_KEY, UserManagementRelations } from '@app/domain';
import { HalFormClientModule } from '@hal-form-client';
import { Pact } from '@pact-foundation/pact';
import { UserManagementService } from 'apps/app/src/app/modules/administration/modules/user-management/services/user-management.service';
import { AdministrationService } from 'apps/app/src/app/modules/administration/services/administration.service';
import * as path from 'path';
import { tap } from 'rxjs';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { jwtToken } from '../../utils/token.util';
import { GetOneUserPacts } from './user.resource.pact';

const provider = new Pact({
  consumer: 'app-user',
  provider: 'api',
  log: path.resolve(process.cwd(), 'libs', 'consumer-pact', 'logs', 'pact.log'),
  logLevel: 'debug',
  dir: path.resolve(process.cwd(), 'pacts'), // spec: 2,
  // port: 9999,
  // cors: true,
  timeout: 10000,
  spec: 2,
});

describe.skip('User Resource Pacts', () => {
  let service: UserManagementService;
  let adminService: AdministrationService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });
    adminService = TestBed.inject(AdministrationService);
    adminService.setRootResource({
      _links: {
        self: { href: '' },
      },
      _embedded: {
        [UserManagementRelations.USER_MANAGEMENT_REL]: {
          _links: {
            self: { href: '' },
            [UserManagementRelations.USER_REL]: {
              href: '/api/user/{userId}',
            },
          },
        },
      },
    });
    service = new UserManagementService(TestBed.inject(HttpClient), adminService);
  });

  describe('Get One User Pacts', () => {
    it('returns server health', (done) => {
      provider.addInteraction(GetOneUserPacts.getOneUser).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['user:read'] }));
        service
          .fetchUser('u1')
          .pipe(tap({ next: console.log, error: console.log }))
          .subscribe((value) => {
            console.log(value);
            done();
          });
      });
    });
  });
});
