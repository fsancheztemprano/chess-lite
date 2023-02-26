package dev.kurama.api.ttt.move;

import static dev.kurama.api.core.utility.AuthorityUtils.getCurrentUserId;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.ttt.core.TicTacToeUtils.isLegalMove;

import com.google.common.collect.Lists;
import dev.kurama.api.core.exception.domain.ForbiddenException;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.TicTacToeGameService;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayerService;
import java.util.Collection;
import java.util.List;
import javax.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicTacToeGameMoveFacility {

  @NonNull
  private final TicTacToeGameService ticTacToeGameService;

  @NonNull
  private final TicTacToeGameMoveService ticTacToeGameMoveService;

  @NonNull
  private final TicTacToePlayerService ticTacToePlayerService;

  @Transactional
  public TicTacToeGame move(String gameId, TicTacToeGameMoveInput input) {
    TicTacToeGame game = ticTacToeGameService.findById(gameId);

    if (game.getStatus() != TicTacToeGame.Status.IN_PROGRESS) {
      throw new ForbiddenException("Game is not in progress");
    }
    TicTacToePlayer player = game.getCurrentPlayer();
    if (!player.getId().equals(getCurrentUserId()) && !hasAuthority(TicTacToeAuthority.TIC_TAC_TOE_GAME_MOVE)) {
      throw new ForbiddenException("It is not your turn");
    }
    if (!isLegalMove(game.getBoard(), input.getCell())) {
      throw new IllegalArgumentException("Illegal move " + input.getCell());
    }

    TicTacToeGameMove move = ticTacToeGameMoveService.createMove(game, input.getCell());

    game = ticTacToeGameService.applyMove(game, move);

    if (game.getStatus() == Status.FINISHED) {
      ticTacToePlayerService.registerGameResult(game.getPlayerX(), game.getPlayerO(), game.getTurn());
    }

    return game;
  }

  public Collection<TicTacToeGameMove> getAllGameMoves(String gameId) {
    TicTacToeGame game = ticTacToeGameService.findById(gameId);
    List<String> players = Lists.newArrayList(game.getPlayerX().getId(), game.getPlayerO().getId());
    if (game.isPrivate() && (!hasAuthority(TicTacToeAuthority.TIC_TAC_TOE_GAME_READ) && !players.contains(
      getCurrentUserId()))) {
      throw new ForbiddenException("You are not allowed to view this game's moves");
    }

    return game.getMoves();
  }
}
