import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TicTacToeAuthority } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { noop } from 'rxjs';
import { avengersAssemble } from '../../../interceptor/pact.interceptor';
import { pactForResource } from '../../../utils/pact.utils';
import { setToken } from '../../../utils/token.utils';
import { GetTicTacToeRootResource } from './tic-tac-toe-root.pact';

const provider: Pact = pactForResource('ticTacToeRoot');

describe('Tic Tac Toe Root Resource Pacts', () => {
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
    TestBed.inject(HalFormService).setResource({ _links: { 'tic-tac-toe': { href: '/api/tic-tac-toe' } } });
  });

  describe('get root tic-tac-toe resource with authority', () => {
    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetTicTacToeRootResource.unauthorized;
      provider.addInteraction(interaction).then(() => {
        setToken();
        jest.spyOn(console, 'error').mockImplementationOnce(noop);
        service.initialize().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('as player', (done) => {
      const interaction: InteractionObject = GetTicTacToeRootResource.as_player;
      provider.addInteraction(interaction).then(() => {
        setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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
        setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_READ] });
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(interaction.willRespondWith.body);
          done();
        });
      });
    });
  });
});
