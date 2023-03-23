import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TicTacToeAuthority, TicTacToeGame, TicTacToeGameStatus } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { HalFormClientModule, Resource } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../../interceptor/pact.interceptor';
import { pactForResource } from '../../../utils/pact.utils';
import { setToken } from '../../../utils/token.utils';
import {
  createGameTemplate,
  CreateTicTacToeGamePact,
  GetAllTicTacToeGamesPact,
  GetOneTicTacToeGamePact,
  moveTemplate,
  MoveTicTacToeGamePact,
  PatchOneTicTacToeGamePact,
  statusTemplate,
} from './tic-tac-toe-game.pact';

const provider: Pact = pactForResource('ticTacToeGame');

describe.skip('Tic Tac Toe Game Resource Pacts', () => {
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

    it('read', (done) => {
      provider.addInteraction(GetAllTicTacToeGamesPact.all_for_admin).then(() => {
        setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_READ] });
        service.getAllGames().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toHaveLength(4);
          done();
        });
      });
    });

    it('read', (done) => {
      provider.addInteraction(GetAllTicTacToeGamesPact.affected_or_public_for_player).then(() => {
        setToken({ user: { id: 'user-a-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
        service.getAllGames().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toHaveLength(3);
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

  describe('create tic-tac-toe game with authority', () => {
    beforeEach(() => service.setResource({ _templates: { ...createGameTemplate } }));

    it('create as player', (done) => {
      const interaction: InteractionObject = CreateTicTacToeGamePact.successful_as_player;
      setToken({ user: { id: 'user-a-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        service.createGame({ playerOUsername: 'user-a-id', playerXUsername: 'user-b-id' }).subscribe(() => done());
      });
    });

    it('create as admin', (done) => {
      const interaction: InteractionObject = CreateTicTacToeGamePact.successful_as_admin;
      setToken({ user: { id: 'admin-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE] });
      provider.addInteraction(interaction).then(() => {
        service.createGame({ playerOUsername: 'user-a-id', playerXUsername: 'user-b-id' }).subscribe(() => done());
      });
    });

    it('error unauthorized', (done) => {
      const interaction: InteractionObject = CreateTicTacToeGamePact.error_unauthorized;
      setToken();
      provider.addInteraction(interaction).then(() => {
        service.createGame({ playerOUsername: 'user-a-id', playerXUsername: 'user-b-id' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('error no opponent', (done) => {
      const interaction: InteractionObject = CreateTicTacToeGamePact.error_no_opponent;
      setToken({ user: { id: 'admin-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE] });
      provider.addInteraction(interaction).then(() => {
        service.createGame({ playerOUsername: 'user-a-id', playerXUsername: 'user-a-id' }).subscribe({
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
      const interaction: InteractionObject = CreateTicTacToeGamePact.error_not_found;
      setToken({ user: { id: 'admin-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE] });
      provider.addInteraction(interaction).then(() => {
        service.createGame({ playerOUsername: 'user-z-id', playerXUsername: 'user-z-id' }).subscribe({
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

    it('private as admin', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.private_as_admin;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_READ] });
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

    it('private as player', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.private_as_player;
      setToken({ user: { id: 'user-a-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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

    it('private as viewer', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.private_as_viewer;
      setToken({ user: { id: 'user-c-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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

    it('public as viewer', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.public_as_viewer;
      setToken({ user: { id: 'user-c-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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

    it('in progress inactive player', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.in_progress_inactive_player;
      setToken({ user: { id: 'user-b-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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
      setToken({ user: { id: 'user-a-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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
      setToken({ user: { id: 'user-c-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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
      setToken({ user: { id: 'user-a-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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
    const game = new TicTacToeGame({ _templates: { ...statusTemplate } });

    it('should reject game as admin', (done) => {
      const interaction: InteractionObject = PatchOneTicTacToeGamePact.as_admin;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE] });
      provider.addInteraction(interaction).then(() => {
        game.changeStatus(TicTacToeGameStatus.REJECTED).subscribe((resource: Resource) => {
          expect(resource._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(resource.status).toBe(interaction.willRespondWith.body.status);
          expect(resource._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });
    it('should accept game as opponent', (done) => {
      const interaction: InteractionObject = PatchOneTicTacToeGamePact.as_opponent_player;
      setToken({ user: { id: 'user-b-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        game.changeStatus(TicTacToeGameStatus.IN_PROGRESS).subscribe((resource: Resource) => {
          expect(resource._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(resource.status).toBe(interaction.willRespondWith.body.status);
          expect(resource._templates).toMatchObject(interaction.willRespondWith.body._templates);
          done();
        });
      });
    });

    it('error as viewer', (done) => {
      const interaction: InteractionObject = PatchOneTicTacToeGamePact.error_as_viewer;
      setToken({ user: { id: 'user-c-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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

    it('error unauthorized', (done) => {
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
      const interaction: InteractionObject = PatchOneTicTacToeGamePact.error_not_found;
      setToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        new TicTacToeGame({
          _templates: { status: { method: 'PATCH', target: '/api/tic-tac-toe/game/tic-tac-toe-g0' } },
        })
          .changeStatus(TicTacToeGameStatus.IN_PROGRESS)
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
  });

  describe('move on a tic tac toe game', () => {
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
      setToken({ user: { id: 'user-a-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
      provider.addInteraction(interaction).then(() => {
        game.move('A2').subscribe(() => done());
      });
    });

    it('should not make a move as inactive player', (done) => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.error_as_inactive_player;
      setToken({ user: { id: 'user-b-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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
      setToken({ user: { id: 'user-c-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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
      setToken({ user: { id: 'user-a-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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
      setToken({ user: { id: 'user-a-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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
      setToken({ user: { id: 'user-a-id' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] });
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
