import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TicTacToeAuthority, TicTacToeGame, TokenKeys } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { HalFormClientModule } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../../interceptor/pact.interceptor';
import { pactForResource } from '../../../utils/pact.utils';
import { jwtToken } from '../../../utils/token.utils';
import {
  createGameTemplate,
  CreateTicTacToeGamePact,
  GetAllTicTacToeGamesPact,
  GetMyTicTacToeGamesPact,
  GetOneTicTacToeGamePact,
  moveTemplate,
  MoveTicTacToeGamePact,
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
    beforeEach(() => service.setResource({ _links: { games: { href: '/api/tic-tac-toe/games' } } }));

    it('read', (done) => {
      provider.addInteraction(GetAllTicTacToeGamesPact.successful).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_READ] }));
        service.getAllGames().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toHaveLength(1);
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetAllTicTacToeGamesPact.error_unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] }));
        service.getAllGames().subscribe({
          error: (error) => {
            expect(error).toBeTruthy();
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });

  describe('get my tic-tac-toe games with authority', () => {
    beforeEach(() => service.setResource({ _links: { 'my-games': { href: '/api/tic-tac-toe/my-games' } } }));

    it('read', (done) => {
      provider.addInteraction(GetMyTicTacToeGamesPact.successful).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({
            user: { id: 'user-a-id' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        );
        service.getMyGames().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toHaveLength(1);
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetMyTicTacToeGamesPact.error_unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
        service.getMyGames().subscribe({
          error: (error) => {
            expect(error).toBeTruthy();
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
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({
          user: { id: 'user-a-id' },
          authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
        }),
      );
      provider.addInteraction(interaction).then(() => {
        service.createGame('user-a-id', 'user-b-id').subscribe((resource) => {
          expect(resource).toBeTruthy();
          done();
        });
      });
    });

    it('create as admin', (done) => {
      const interaction: InteractionObject = CreateTicTacToeGamePact.successful_as_admin;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({
          user: { id: 'admin-id' },
          authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE],
        }),
      );
      provider.addInteraction(interaction).then(() => {
        service.createGame('user-a-id', 'user-b-id').subscribe((resource) => {
          expect(resource).toBeTruthy();
          done();
        });
      });
    });

    it('error non admin', (done) => {
      const interaction: InteractionObject = CreateTicTacToeGamePact.error_not_admin;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({
          user: { id: 'user-a-id' },
          authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
        }),
      );
      provider.addInteraction(interaction).then(() => {
        service.createGame('user-b-id', 'user-c-id').subscribe({
          error: (error) => {
            expect(error).toBeTruthy();
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('error unauthorized', (done) => {
      const interaction: InteractionObject = CreateTicTacToeGamePact.error_unauthorized;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service.createGame('user-a-id', 'user-b-id').subscribe({
          error: (error) => {
            expect(error).toBeTruthy();
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('error no opponent', (done) => {
      const interaction: InteractionObject = CreateTicTacToeGamePact.error_no_opponent;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({
          user: { id: 'admin-id' },
          authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE],
        }),
      );
      provider.addInteraction(interaction).then(() => {
        service.createGame('user-a-id', 'user-a-id').subscribe({
          error: (error) => {
            expect(error).toBeTruthy();
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });

  describe('get one tic-tac-toe game', () => {
    beforeEach(() =>
      service.setResource({
        _links: {
          game: {
            href: '/api/tic-tac-toe/games/{gameId}',
            templated: true,
          },
        },
      }),
    );

    it('private as admin', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.private_as_admin;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_READ] }));
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g1').subscribe((resource) => {
          expect(resource).toBeTruthy();
          done();
        });
      });
    });

    it('private as player', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.private_as_player;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({
          user: { id: 'user-a-id' },
          authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
        }),
      );
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g1').subscribe((resource) => {
          expect(resource).toBeTruthy();
          done();
        });
      });
    });

    it('private as viewer', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.private_as_viewer;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({
          user: { id: 'user-c-id' },
          authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
        }),
      );
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g1').subscribe({
          error: (error) => {
            expect(error).toBeTruthy();
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('public as viewer', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.public_as_viewer;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({
          user: { id: 'user-c-id' },
          authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
        }),
      );
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g2').subscribe((resource) => {
          expect(resource).toBeTruthy();
          done();
        });
      });
    });

    it('in progress inactive player', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.in_progress_inactive_player;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({
          user: { id: 'user-b-id' },
          authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
        }),
      );
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g1').subscribe((resource) => {
          expect(resource).toBeTruthy();
          done();
        });
      });
    });

    it('in progress active player', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.in_progress_active_player;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({
          user: { id: 'user-a-id' },
          authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
        }),
      );
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g1').subscribe((resource) => {
          expect(resource).toBeTruthy();
          done();
        });
      });
    });

    it('finished', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.finished;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({
          user: { id: 'user-a-id' },
          authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
        }),
      );
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g1').subscribe((resource) => {
          expect(resource).toBeTruthy();
          done();
        });
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.error_not_found;
      localStorage.setItem(
        TokenKeys.TOKEN,
        jwtToken({
          user: { id: 'user-a-id' },
          authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
        }),
      );
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g0').subscribe({
          error: (error) => {
            expect(error).toBeTruthy();
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetOneTicTacToeGamePact.error_unauthorized;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken());
      provider.addInteraction(interaction).then(() => {
        service.getGame('tic-tac-toe-g1').subscribe({
          error: (error) => {
            expect(error).toBeTruthy();
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });

  describe('move on a tic tac toe game', () => {
    const game = new TicTacToeGame({ _templates: { ...moveTemplate } });

    it('should make a move as admin', () => {
      const interaction: InteractionObject = MoveTicTacToeGamePact.successful_as_admin;
      localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_MOVE] }));
      provider.addInteraction(interaction).then(() => {
        game.move('A2').subscribe((resource) => {
          expect(resource).toBeTruthy();
        });
      });
    });
  });
});
