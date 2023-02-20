import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TokenKeys } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { noop } from 'rxjs';
import { avengersAssemble } from '../../../interceptor/pact.interceptor';
import { pactForResource } from '../../../utils/pact.utils';
import { jwtToken } from '../../../utils/token.utils';
import { GetTicTacToeRootResource } from './ttc-root.pact';

const provider: Pact = pactForResource('ttcRoot');

describe.skip('Tic Tac Toe Root Resource Pacts', () => {
  let service: TicTacToeService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule.forRoot('/api')],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });
    service = TestBed.inject(TicTacToeService);
    TestBed.inject(HalFormService).setResource({ _links: { 'ttc-game': { href: '/api/ttc' } } });
  });

  describe('get root ttc resource with authority', () => {
    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetTicTacToeRootResource.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
        jest.spyOn(console, 'error').mockImplementationOnce(noop);
        service.initialize().subscribe({
          error: (error) => {
            expect(error).toBeTruthy();
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('as player', (done) => {
      const interaction: InteractionObject = GetTicTacToeRootResource.as_player;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: ['ttc:game'] }));
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(interaction.willRespondWith.body);
          done();
        });
      });
    });

    it('as admin', (done) => {
      const interaction: InteractionObject = GetTicTacToeRootResource.as_admin;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: ['ttc:game:read'] }));
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(interaction.willRespondWith.body);
          done();
        });
      });
    });
  });
});
