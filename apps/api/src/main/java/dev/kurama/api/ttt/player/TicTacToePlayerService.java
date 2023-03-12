package dev.kurama.api.ttt.player;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import java.util.List;
import java.util.Optional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicTacToePlayerService {

  @NonNull
  private final TicTacToePlayerRepository repository;

  public boolean existsById(String userId) {
    return repository.existsById(userId);
  }

  public Optional<TicTacToePlayer> getPlayerByUsername(String username) {
    return repository.findByUserUsername(username);
  }

  public List<TicTacToePlayer> findPlayers(String username) {
    return repository.findAllByUser_UsernameLike("%" + username + "%");
  }

  public TicTacToePlayer create(String userId) {
    var ticTacToePlayer = TicTacToePlayer.builder()
      .id(userId)
      .user(User.builder().id(userId).build())
      .draws(0)
      .losses(0)
      .wins(0)
      .build();
    return repository.save(ticTacToePlayer);
  }

  public void registerGameResult(TicTacToePlayer playerX, TicTacToePlayer playerO, Token turn) {
    switch (turn) {
      case X -> {
        playerX.setWins(playerX.getWins() + 1);
        playerO.setLosses(playerO.getLosses() + 1);
      }
      case O -> {
        playerX.setLosses(playerX.getLosses() + 1);
        playerO.setWins(playerO.getWins() + 1);
      }
      case NONE -> {
        playerX.setDraws(playerX.getDraws() + 1);
        playerO.setDraws(playerO.getDraws() + 1);
      }
    }
    repository.saveAll(List.of(playerX, playerO));
  }
}
