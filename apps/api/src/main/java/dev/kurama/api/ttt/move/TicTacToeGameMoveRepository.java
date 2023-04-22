package dev.kurama.api.ttt.move;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicTacToeGameMoveRepository extends JpaRepository<TicTacToeGameMove, String> {

}
