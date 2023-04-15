package dev.kurama.api.ttt.player;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicTacToePlayerRepository extends JpaRepository<TicTacToePlayer, String> {

  Optional<TicTacToePlayer> findByUserUsername(String username);

  List<TicTacToePlayer> findAllByUserUsernameLike(String like);
}
