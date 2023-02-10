import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AdminAuthority, ProfileAuthority, TokenAuthority, TokenKeys } from '@app/ui/shared/domain';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { JsonObject, pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.utils';
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
      const interaction: InteractionObject = GetRootResource.unauthorized;
      provider.addInteraction(interaction).then(() => {
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject((<JsonObject>interaction.willRespondWith).body);
          done();
        });
      });
    });

    it('authorized', (done) => {
      const interaction: InteractionObject = GetRootResource.authorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(interaction.willRespondWith.body!);
          done();
        });
      });
    });

    it(ProfileAuthority.PROFILE_READ, (done) => {
      const interaction: InteractionObject = GetRootResource.with_profile_read;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [ProfileAuthority.PROFILE_READ] }));
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject((<JsonObject>interaction.willRespondWith).body);
          done();
        });
      });
    });

    it(TokenAuthority.TOKEN_REFRESH, (done) => {
      const interaction: InteractionObject = GetRootResource.with_token_refresh;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [TokenAuthority.TOKEN_REFRESH] }));
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject((<JsonObject>interaction.willRespondWith).body);
          done();
        });
      });
    });

    it(AdminAuthority.ADMIN_ROOT, (done) => {
      const interaction: InteractionObject = GetRootResource.with_admin_root;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [AdminAuthority.ADMIN_ROOT] }));
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject((<JsonObject>interaction.willRespondWith).body);
          done();
        });
      });
    });
  });
});
