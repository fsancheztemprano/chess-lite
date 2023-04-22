package dev.kurama.api.ttt.move;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = NONE)
@ActiveProfiles(value = "integration-test")
class TicTacToeGameMoveRepositoryIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private TicTacToeGameMoveRepository repository;

  @Test
  void should_save_move() {
    TicTacToeGameMove move = TicTacToeGameMove.builder()
      .setRandomUUID()
      .board("OX__X__XO")
      .cell("B2")
      .token(Token.X)
      .number(1)
      .movedAt(LocalDateTime.now())
      .moveTime(1000L)
      .build();

    repository.save(move);

    TicTacToeGameMove actual = entityManager.find(TicTacToeGameMove.class, move.getId());

    assertNotNull(actual);
    assertEquals(move.getId(), actual.getId());
  }

}
