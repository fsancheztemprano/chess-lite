package dev.kurama.api.ttt.game;

import java.util.Collection;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicTacToeGameRepository extends JpaRepository<TicTacToeGame, String> {

  boolean existsTicTacToeGameByPlayerOIdInAndPlayerXIdInAndStatus(Collection<String> playerO,
                                                                  Collection<String> playerX,
                                                                  @NonNull TicTacToeGame.Status status);

  Page<TicTacToeGame> findAllByPlayerXIdOrPlayerOIdOOrPrivate(String currentUserId,
                                                              String currentUserId1,
                                                              boolean isPrivate,
                                                              Pageable pageable);
}
