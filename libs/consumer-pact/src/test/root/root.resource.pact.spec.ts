import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TOKEN_KEY } from '@app/domain';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { Pact } from '@pact-foundation/pact';
import { jwtToken } from 'libs/consumer-pact/src/utils/token.util';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { GetRootResourcePacts } from './root.resource.pact';

const provider: Pact = pactForResource('root');

describe('Root Resource Pacts', () => {
  let service: HalFormService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule.forRoot('/api')],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });
    service = TestBed.inject(HalFormService);
  });

  describe('get root resource with authority', () => {
    it('none', (done) => {
      provider.addInteraction(GetRootResourcePacts.getRootResourceAsUnauthorized).then(() => {
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(GetRootResourcePacts.getRootResourceAsUnauthorized.willRespondWith.body);
          done();
        });
      });
    });

    it('profile:read', (done) => {
      provider.addInteraction(GetRootResourcePacts.getRootResource_profile_read).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['profile:read'] }));
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(GetRootResourcePacts.getRootResource_profile_read.willRespondWith.body);
          done();
        });
      });
    });

    it('admin:root', (done) => {
      provider.addInteraction(GetRootResourcePacts.getRootResource_admin_root).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['admin:root'] }));
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(GetRootResourcePacts.getRootResource_admin_root.willRespondWith.body);
          done();
        });
      });
    });
  });
});
