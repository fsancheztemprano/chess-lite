package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.utility.AuthorityUtils.getCurrentUsername;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import dev.kurama.api.ttt.game.input.TicTacToeGameInput;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayerService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicTacToeGameFacility {

  @NonNull
  private final TicTacToeGameService gameService;

  @NonNull
  private final TicTacToePlayerService playerService;

  public TicTacToeGame create(TicTacToeGameInput ticTacToeGameInput) {
    if (isEmpty(ticTacToeGameInput.getPlayerXUsername()) || !hasAuthority(TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE)) {
      ticTacToeGameInput.setPlayerXUsername(getCurrentUsername());
    }
    if (ticTacToeGameInput.getPlayerXUsername().equals(ticTacToeGameInput.getPlayerOUsername())) {
      throw new IllegalArgumentException("X and O cannot be the same player");
    }

    TicTacToePlayer xPlayer = playerService.getPlayerByUsername(ticTacToeGameInput.getPlayerXUsername())
      .orElseThrow(() -> new EntityNotFoundException(ticTacToeGameInput.getPlayerXUsername(), TicTacToePlayer.class));
    TicTacToePlayer oPlayer = playerService.getPlayerByUsername(ticTacToeGameInput.getPlayerOUsername())
      .orElseThrow(() -> new EntityNotFoundException(ticTacToeGameInput.getPlayerOUsername(), TicTacToePlayer.class));

    return gameService.create(ticTacToeGameInput, xPlayer, oPlayer);
  }

}
