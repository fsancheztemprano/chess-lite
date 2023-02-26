package dev.kurama.api.ttt.player;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicTacToePlayerRepository extends JpaRepository<TicTacToePlayer, String> {

}
