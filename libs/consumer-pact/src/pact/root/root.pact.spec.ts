import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AdminAuthority, ProfileAuthority, TicTacToeAuthority, TokenAuthority } from '@app/ui/shared/domain';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { setToken } from '../../utils/token.utils';
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
          done();
        });
      });
    });

    it('authorized', (done) => {
      const interaction: InteractionObject = GetRootResource.authorized;
      provider.addInteraction(interaction).then(() => {
        setToken();
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(interaction.willRespondWith.body!);
          done();
        });
      });
    });

    it(ProfileAuthority.PROFILE_READ, (done) => {
      provider.addInteraction(GetRootResource.with_profile_read).then(() => {
        setToken({ authorities: [ProfileAuthority.PROFILE_READ] });
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          done();
        });
      });
    });

    it(TicTacToeAuthority.TIC_TAC_TOE_ROOT, (done) => {
      const interaction: InteractionObject = GetRootResource.with_tic_tac_toe_root;
      provider.addInteraction(interaction).then(() => {
        setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(interaction.willRespondWith.body!);
          done();
        });
      });
    });

    it(TokenAuthority.TOKEN_REFRESH, (done) => {
      provider.addInteraction(GetRootResource.with_token_refresh).then(() => {
        setToken({ authorities: [TokenAuthority.TOKEN_REFRESH] });
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          done();
        });
      });
    });

    it(AdminAuthority.ADMIN_ROOT, (done) => {
      provider.addInteraction(GetRootResource.with_admin_root).then(() => {
        setToken({ authorities: [AdminAuthority.ADMIN_ROOT] });
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          done();
        });
      });
    });
  });
});
