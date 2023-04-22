package dev.kurama.api.ttt.game;

import java.util.Collection;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TicTacToeGameRepository extends JpaRepository<TicTacToeGame, String>,
                                                 JpaSpecificationExecutor<TicTacToeGame> {

  boolean existsTicTacToeGameByPlayerXIdInAndPlayerOIdInAndStatus(Collection<String> playerX,
                                                                  Collection<String> playerO,
                                                                  @NonNull TicTacToeGame.Status status);
}
