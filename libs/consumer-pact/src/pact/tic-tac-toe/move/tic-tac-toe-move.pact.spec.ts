import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TicTacToeAuthority, TicTacToeGame } from '@app/ui/shared/domain';
import { HalFormClientModule } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../../interceptor/pact.interceptor';
import { pactForResource } from '../../../utils/pact.utils';
import { setToken } from '../../../utils/token.utils';
import { gameWithId, moveTemplate } from '../tic-tac-toe.mock';
import { AllTicTacToeGameMoves, MoveTicTacToeGamePact } from './tic-tac-toe-move.pact';

const provider: Pact = pactForResource('ticTacToeMove');

describe('Tic Tac Toe Move Resource Pacts', () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule.forRoot('/api')],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });
    TestBed.inject(HttpClientModule);
  });

  describe('move on a tic tac toe game', () => {
    const game = new TicTacToeGame({ _templates: { ...moveTemplate } });

    it('should make a move', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.successful;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        game.move('B3').subscribe((move) => {
          expect(move).toBeTruthy();
          expect(move).toMatchObject(interaction.willRespondWith.body!);
          done();
        });
      });
    });

    it('should not make a move if game is not found', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.error_not_found;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        new TicTacToeGame({
          _templates: {
            move: {
              method: 'POST',
              target: '/api/tic-tac-toe/game/tic-tac-toe-g0/move',
            },
          },
        })
          .move('B3')
          .subscribe({
            error: (error: HttpErrorResponse) => {
              expect(error).toBeTruthy();
              expect(error.status).toBe(interaction.willRespondWith.status);
              expect(error.error).toMatchObject(interaction.willRespondWith.body!);
              done();
            },
          });
      });
    });

    it('should not make a move if unauthorized', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.error_unauthorized;
      setToken();
      provider.addInteraction(interaction).then(() => {
        game.move('B3').subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body!);
            done();
          },
        });
      });
    });
  });

  describe('get all tic tac toe game moves', () => {
    const game = new TicTacToeGame(gameWithId('tic-tac-toe-g2', true));

    it('should get all moves', (done) => {
      const interaction: InteractionObject = AllTicTacToeGameMoves.successful;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        game.getMoves().subscribe((move) => {
          expect(move).toBeTruthy();
          done();
        });
      });
    });

    it('should get all error unauthorized', (done) => {
      const noGame = new TicTacToeGame(gameWithId('tic-tac-toe-g0', true));

      const interaction: InteractionObject = AllTicTacToeGameMoves.error_not_found;
      setToken();
      provider.addInteraction(interaction).then(() => {
        noGame.getMoves().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body!);
            done();
          },
        });
      });
    });

    it('should get all error unauthorized', (done) => {
      const interaction: InteractionObject = AllTicTacToeGameMoves.error_unauthorized;
      setToken();
      provider.addInteraction(interaction).then(() => {
        game.getMoves().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body!);
            done();
          },
        });
      });
    });
  });
});
