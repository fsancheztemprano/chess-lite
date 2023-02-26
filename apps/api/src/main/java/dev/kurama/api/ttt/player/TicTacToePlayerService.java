package dev.kurama.api.ttt.player;

import dev.kurama.api.core.domain.User;
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

  public Optional<TicTacToePlayer> getPlayerById(String playerId) {
    return repository.findById(playerId);
  }
}
