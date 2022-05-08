import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TOKEN_KEY } from '@app/ui/shared/domain';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';
import { GetRootResource } from './root.pact';

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
    it('unauthorized', (done) => {
      provider.addInteraction(GetRootResource.unauthorized).then(() => {
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(GetRootResource.unauthorized.willRespondWith.body);
          done();
        });
      });
    });

    it('authorized', (done) => {
      const interaction: InteractionObject = GetRootResource.authorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken());
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(interaction.willRespondWith.body);
          done();
        });
      });
    });

    it('profile:read', (done) => {
      provider.addInteraction(GetRootResource.with_profile_read).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['profile:read'] }));
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(GetRootResource.with_profile_read.willRespondWith.body);
          done();
        });
      });
    });

    it('token:refresh', (done) => {
      provider.addInteraction(GetRootResource.with_token_refresh).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['token:refresh'] }));
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(GetRootResource.with_token_refresh.willRespondWith.body);
          done();
        });
      });
    });

    it('admin:root', (done) => {
      provider.addInteraction(GetRootResource.with_admin_root).then(() => {
        localStorage.setItem(TOKEN_KEY, jwtToken({ authorities: ['admin:root'] }));
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(GetRootResource.with_admin_root.willRespondWith.body);
          done();
        });
      });
    });
  });
});
