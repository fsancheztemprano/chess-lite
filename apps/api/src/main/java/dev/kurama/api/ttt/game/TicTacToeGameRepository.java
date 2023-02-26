package dev.kurama.api.ttt.game;

import java.util.Collection;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicTacToeGameRepository extends JpaRepository<TicTacToeGame, String> {

  boolean existsTicTacToeGameByPlayerXIdInAndPlayerOIdInAndStatus(Collection<String> playerX,
                                                                  Collection<String> playerO,
                                                                  @NonNull TicTacToeGame.Status status);

  Page<TicTacToeGame> findAllByPlayerXIdOrPlayerOIdOrPrivate(String currentUserId,
                                                             String currentUserId1,
                                                             Boolean isPrivate,
                                                             Pageable pageable);
}
