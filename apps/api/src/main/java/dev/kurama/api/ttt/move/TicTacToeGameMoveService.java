package dev.kurama.api.ttt.move;

import static dev.kurama.api.ttt.core.TicTacToeUtils.getIndexInBoard;

import dev.kurama.api.ttt.game.TicTacToeGame;
import java.time.Duration;
import java.time.LocalDateTime;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicTacToeGameMoveService {

  @NonNull
  private final TicTacToeGameMoveRepository repository;

  public TicTacToeGameMove createMove(TicTacToeGame game, String cell) {
    int indexInBoard = getIndexInBoard(cell);
    String newBoard = StringUtils.overlay(game.getBoard(), String.valueOf(game.getTurn()), indexInBoard,
      indexInBoard + 1);
    LocalDateTime movedAt = LocalDateTime.now();
    TicTacToeGameMove move = TicTacToeGameMove.builder()
      .setRandomUUID()
      .cell(cell)
      .token(game.getTurn())
      .board(newBoard)
      .number(game.getMoves().size() + 1)
      .game(game)
      .player(game.getCurrentPlayer())
      .movedAt(movedAt)
      .moveTime(Duration.between(game.getLastActivityAt(), movedAt).toMillis())
      .build();

    return repository.save(move);
  }
}
