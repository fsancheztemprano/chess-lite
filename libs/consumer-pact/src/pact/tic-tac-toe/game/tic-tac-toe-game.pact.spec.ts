import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TicTacToeAuthority, TicTacToeGame, TicTacToeGameStatus } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { HalFormClientModule, Resource } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../../interceptor/pact.interceptor';
import { pactForResource } from '../../../utils/pact.utils';
import { setToken } from '../../../utils/token.utils';
import { createGameTemplate, gameWithId, statusTemplate } from '../tic-tac-toe.mock';
import {
  CreateTicTacToeGamePact,
  GetAllTicTacToeGamesPact,
  GetOneTicTacToeGamePact,
  PatchOneTicTacToeGamePact,
} from './tic-tac-toe-game.pact';

const provider: Pact = pactForResource('ticTacToeGame');

describe('Tic Tac Toe Game Resource Pacts', () => {
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
  });

  describe('get all tic-tac-toe games with authority', () => {
    beforeEach(() => service.setResource({ _links: { games: { href: '/api/tic-tac-toe/game' } } }));

    it('get all', (done) => {
      const interaction: InteractionObject = GetAllTicTacToeGamesPact.get_all;
      provider.addInteraction(interaction).then(() => {
        setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
        service.getAllGames().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource.page).toEqual(interaction.willRespondWith.body.page);
          expect(resource.list).toHaveLength(4);
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetAllTicTacToeGamesPact.error_unauthorized;
      provider.addInteraction(interaction).then(() => {
        setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
        service.getAllGames().subscribe({
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

  describe('create tic-tac-toe game', () => {
    beforeEach(() => service.setResource({ _templates: { ...createGameTemplate } }));

    it('successful', (done) => {
      const interaction: InteractionObject = CreateTicTacToeGamePact.successful;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        service.createGame({ playerOUsername: 'tic-tac-toe-p2', isPrivate: true }).subscribe((game) => {
          expect(game).toBeTruthy();
          expect(game._links).toMatchObject(interaction.willRespondWith.body._links);
          done();
        });
      });
    });

    it('error unauthorized', (done) => {
      const interaction: InteractionObject = CreateTicTacToeGamePact.error_unauthorized;
      setToken();
      provider.addInteraction(interaction).then(() => {
        service.createGame({ playerOUsername: 'tic-tac-toe-p2', isPrivate: true }).subscribe({
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

  describe('get one tic tac toe game', () => {
    beforeEach(() =>
      service.setResource({
        _links: {
          game: {
            href: '/api/tic-tac-toe/game/{gameId}',
            templated: true,
          },
        },
      }),
    );

    it('pending', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.pending;
      setToken({ user: { id: 'tic-tac-toe-p1' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g1').subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(resource.status).toBe(interaction.willRespondWith.body.status);
          expect(resource._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('pending as user', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.pending_with_user_status;
      setToken({ user: { id: 'tic-tac-toe-p2' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g1').subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(resource.status).toBe(interaction.willRespondWith.body.status);
          expect(resource._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('pending as admin', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.pending_with_admin_status;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT, TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE] });
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g1').subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(resource.status).toBe(interaction.willRespondWith.body.status);
          expect(resource._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('public as viewer', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.in_progress_inactive;
      setToken({ user: { id: 'tic-tac-toe-p2' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g2').subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(resource.status).toBe(interaction.willRespondWith.body.status);
          expect(resource._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('in progress active player', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.in_progress_active_player;
      setToken({ user: { id: 'tic-tac-toe-p1' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g2').subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(resource.status).toBe(interaction.willRespondWith.body.status);
          expect(resource._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('rejected', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.rejected;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g3').subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(resource.status).toBe(interaction.willRespondWith.body.status);
          expect(resource._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('finished', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.finished;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g4').subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(resource.status).toBe(interaction.willRespondWith.body.status);
          expect(resource._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.error_not_found;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g0').subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.error_unauthorized;
      setToken();
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g1').subscribe({
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

  describe('tic tac toe game status change', () => {
    it('should accept game', (done) => {
      const game = new TicTacToeGame({ ...gameWithId('tic-tac-toe-g2'), _templates: { ...statusTemplate } });
      const interaction: InteractionObject = PatchOneTicTacToeGamePact.accept;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        game.changeStatus(TicTacToeGameStatus.IN_PROGRESS).subscribe((resource: Resource) => {
          expect(resource._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(resource.status).toBe(interaction.willRespondWith.body.status);
          expect(resource._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('should reject game ', (done) => {
      const game = new TicTacToeGame({ ...gameWithId('tic-tac-toe-g3'), _templates: { ...statusTemplate } });
      const interaction: InteractionObject = PatchOneTicTacToeGamePact.reject;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        game.changeStatus(TicTacToeGameStatus.REJECTED).subscribe((resource: Resource) => {
          expect(resource._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(resource.status).toBe(interaction.willRespondWith.body.status);
          expect(resource._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('error unauthorized', (done) => {
      const game = new TicTacToeGame({ ...gameWithId('tic-tac-toe-g1'), _templates: { ...statusTemplate } });
      const interaction: InteractionObject = PatchOneTicTacToeGamePact.error_unauthorized;
      setToken();
      provider.addInteraction(interaction).then(() => {
        game.changeStatus(TicTacToeGameStatus.IN_PROGRESS).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('error not found', (done) => {
      const game = new TicTacToeGame({ ...gameWithId('tic-tac-toe-g0'), _templates: { ...statusTemplate } });
      const interaction: InteractionObject = PatchOneTicTacToeGamePact.error_not_found;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        game.changeStatus(TicTacToeGameStatus.IN_PROGRESS).subscribe({
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
