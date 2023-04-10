package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.utility.AuthorityUtils.getCurrentUserId;
import static dev.kurama.api.core.utility.AuthorityUtils.getCurrentUsername;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.ttt.core.TicTacToeUtils.isGameOver;
import static dev.kurama.api.ttt.core.TicTacToeUtils.isGameTied;
import static org.apache.commons.lang3.BooleanUtils.isTrue;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.google.common.collect.Lists;
import dev.kurama.api.core.exception.domain.ForbiddenException;
import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.TicTacToeGameSpecification.MyGamesOrPublic;
import dev.kurama.api.ttt.game.input.TicTacToeGameFilterInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameStatusInput;
import dev.kurama.api.ttt.move.TicTacToeGameMove;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import dev.kurama.api.ttt.player.TicTacToePlayerService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicTacToeGameService {

  @NonNull
  private final TicTacToeGameRepository repository;

  @NonNull
  private final TicTacToePlayerService ticTacToePlayerService;

  @NonNull
  private final TicTacToeGameChangedEventEmitter eventEmitter;

  public static final String CHANGE_STATUS_REGEX = "^(REJECTED|IN_PROGRESS)$";

  public TicTacToeGame findById(String gameId) {
    return repository.findById(gameId).orElseThrow();
  }

  public TicTacToeGame create(TicTacToeGameInput ticTacToeGameInput) {
    if (isEmpty(ticTacToeGameInput.getPlayerXUsername()) || !hasAuthority(TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE)) {
      ticTacToeGameInput.setPlayerXUsername(getCurrentUsername());
    }
    if (ticTacToeGameInput.getPlayerXUsername().equals(ticTacToeGameInput.getPlayerOUsername())) {
      throw new IllegalArgumentException("X and O cannot be the same player");
    }
    TicTacToePlayer xPlayer = ticTacToePlayerService.getPlayerByUsername(ticTacToeGameInput.getPlayerXUsername())
      .orElseThrow(() -> new EntityNotFoundException(ticTacToeGameInput.getPlayerXUsername(), TicTacToePlayer.class));
    TicTacToePlayer oPlayer = ticTacToePlayerService.getPlayerByUsername(ticTacToeGameInput.getPlayerOUsername())
      .orElseThrow(() -> new EntityNotFoundException(ticTacToeGameInput.getPlayerOUsername(), TicTacToePlayer.class));

    List<String> playerIds = Lists.newArrayList(xPlayer.getId(), oPlayer.getId());
    if (repository.existsTicTacToeGameByPlayerXIdInAndPlayerOIdInAndStatus(playerIds, playerIds, Status.PENDING)) {
      throw new IllegalArgumentException("Pending Game already exists");
    }

    TicTacToeGame game = TicTacToeGame.builder()
      .setRandomUUID()
      .playerX(xPlayer)
      .playerO(oPlayer)
      .isPrivate(isTrue(ticTacToeGameInput.getIsPrivate()))
      .status(Status.PENDING)
      .requestedAt(LocalDateTime.now())
      .lastActivityAt(LocalDateTime.now())
      .build();

    TicTacToeGame save = repository.save(game);
    eventEmitter.emitTicTacToeGameCreatedEvent(save);
    return save;
  }

  public TicTacToeGame updateStatus(String gameId, TicTacToeGameStatusInput input) {
    if (!input.getStatus().matches(CHANGE_STATUS_REGEX)) {
      throw new IllegalArgumentException("Invalid status " + input.getStatus());
    }
    TicTacToeGame game = repository.findById(gameId).orElseThrow();
    if (!game.getPlayerO().getId().equals(getCurrentUserId()) && !hasAuthority(
      TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE)) {
      throw new ForbiddenException("Not pending for your update");
    }
    if (game.getStatus() != Status.PENDING) {
      throw new ForbiddenException("Game is not pending");
    }
    game.setStatus(Status.valueOf(input.getStatus()));
    game.setLastActivityAt(LocalDateTime.now());
    if (game.getStatus() == Status.IN_PROGRESS) {
      game.setStartedAt(LocalDateTime.now());
      game.setBoard("_________");
      game.setTurn(Token.X);
    }
    TicTacToeGame save = repository.save(game);
    eventEmitter.emitTicTacToeGameUpdatedEvent(save);
    return save;
  }

  public TicTacToeGame applyMove(TicTacToeGame game, TicTacToeGameMove move) {
    game.setBoard(move.getBoard());
    game.setLastActivityAt(LocalDateTime.now());
    game.getMoves().add(move);

    if (isGameOver(game.getBoard())) {
      game.setStatus(Status.FINISHED);
      game.setFinishedAt(LocalDateTime.now());
      if (isGameTied(game.getBoard())) {
        game.setTurn(Token.NONE);
      }
    } else {
      game.setTurn(game.getTurn() == Token.X ? Token.O : Token.X);
    }

    TicTacToeGame save = repository.save(game);
    eventEmitter.emitTicTacToeGameUpdatedEvent(save);
    return save;
  }

  public Page<TicTacToeGame> getAll(Pageable pageable, TicTacToeGameFilterInput filter) {
    Specification<TicTacToeGame> spec =
      hasAuthority(TicTacToeAuthority.TIC_TAC_TOE_GAME_READ) ? new TicTacToeGameSpecification(filter)
        : Specification.where(new TicTacToeGameSpecification(filter).and(new MyGamesOrPublic()));
    return repository.findAll(spec, pageable);
  }
}
