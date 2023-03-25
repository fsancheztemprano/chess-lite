import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TicTacToeAuthority, TicTacToeGame } from '@app/ui/shared/domain';
import { HalFormClientModule } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../../interceptor/pact.interceptor';
import { pactForResource } from '../../../utils/pact.utils';
import { setToken } from '../../../utils/token.utils';
import { moveTemplate } from '../tic-tac-toe.mock';
import { MoveTicTacToeGamePact } from './tic-tac-toe-move.pact';

const provider: Pact = pactForResource('ticTacToeMove');

describe('Tic Tac Toe Move Resource Pacts', () => {
  // let service: TicTacToeService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule.forRoot('/api')],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });
    // service = TestBed.inject(TicTacToeService);
  });

  describe.skip('move on a tic tac toe game', () => {
    const game = new TicTacToeGame({ _templates: { ...moveTemplate } });

    it('should make a move as admin', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.successful_as_admin;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_MOVE] });
      provider.addInteraction(interaction).then(() => {
        game.move('A2').subscribe(() => done());
      });
    });

    it('should make a move as player', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.successful_as_player;
      setToken({ user: { id: 'tic-tac-toe-p1' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        game.move('A2').subscribe(() => done());
      });
    });

    it('should not make a move as inactive player', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.error_as_inactive_player;
      setToken({ user: { id: 'tic-tac-toe-p2' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        game.move('A2').subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('should not make a move as viewer', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.error_as_viewer;
      setToken({ user: { id: 'tic-tac-toe-p3' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        game.move('A2').subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('should not make a move if cell is occupied', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.error_cell_is_occupied;
      setToken({ user: { id: 'tic-tac-toe-p1' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        game.move('A1').subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('should not make a move if game is finished', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.error_game_finished;
      setToken({ user: { id: 'tic-tac-toe-p1' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        new TicTacToeGame({
          _templates: {
            move: {
              method: 'POST',
              target: '/api/tic-tac-toe/game/tic-tac-toe-g4/move',
            },
          },
        })
          .move('A1')
          .subscribe({
            error: (error: HttpErrorResponse) => {
              expect(error).toBeTruthy();
              expect(error.status).toBe(interaction.willRespondWith.status);
              expect(error.error).toMatchObject(interaction.willRespondWith.body);
              done();
            },
          });
      });
    });

    it('should not make a move if game is not found', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.error_not_found;
      setToken({ user: { id: 'tic-tac-toe-p1' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        new TicTacToeGame({
          _templates: {
            move: {
              method: 'POST',
              target: '/api/tic-tac-toe/game/tic-tac-toe-g0/move',
            },
          },
        })
          .move('A1')
          .subscribe({
            error: (error: HttpErrorResponse) => {
              expect(error).toBeTruthy();
              expect(error.status).toBe(interaction.willRespondWith.status);
              expect(error.error).toMatchObject(interaction.willRespondWith.body);
              done();
            },
          });
      });
    });

    it('should not make a move if unauthorized', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.error_unauthorized;
      setToken();
      provider.addInteraction(interaction).then(() => {
        game.move('A1').subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });
});
