package dev.kurama.api.ttt.move;

import dev.kurama.api.ttt.game.TicTacToeGame;
import java.time.LocalDateTime;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicTacToeGameMoveService {

  @NonNull
  private final TicTacToeGameMoveRepository repository;

  public TicTacToeGameMove createMove(TicTacToeGame game, String cell) {

    TicTacToeGameMove move = TicTacToeGameMove.builder()
      .setRandomUUID()
      .cell(cell)
      .token(game.getTurn())
      .board(game.getBoard())
      .number(game.getMoves().size() + 1)
      .game(game)
      .player(game.getCurrentPlayer())
      .movedAt(LocalDateTime.now())
      .build();

    return repository.save(move);
  }
}
