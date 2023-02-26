package dev.kurama.api.ttt.move;

import static dev.kurama.api.core.utility.AuthorityUtils.getCurrentUserId;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.ttt.core.TicTacToeUtils.isLegalMove;

import dev.kurama.api.core.exception.domain.ForbiddenException;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.game.TicTacToeGameService;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import javax.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicTacToeGameMoveFacility {

  @NonNull
  private final TicTacToeGameService service;

  @NonNull
  private final TicTacToeGameMoveService ticTacToeGameMoveService;

  @Transactional
  public TicTacToeGame move(String gameId, TicTacToeGameMoveInput input) {
    TicTacToeGame game = service.findById(gameId);

    if (game.getStatus() != TicTacToeGame.Status.IN_PROGRESS) {
      throw new ForbiddenException("Game is not in progress");
    }
    TicTacToePlayer player = game.getCurrentPlayer();
    if (!player.getId().equals(getCurrentUserId()) || !hasAuthority(TicTacToeAuthority.TIC_TAC_TOE_GAME_MOVE)) {
      throw new ForbiddenException("It is not your turn");
    }
    if (!isLegalMove(game.getBoard(), input.getCell())) {
      throw new IllegalArgumentException("Illegal move " + input.getCell());
    }

    TicTacToeGameMove move = ticTacToeGameMoveService.createMove(game, input.getCell());

    return service.applyMove(game, move);
  }
}
