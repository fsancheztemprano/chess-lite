package dev.kurama.api.ttt.player;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.event.domain.UserChangedEvent;
import dev.kurama.api.core.event.domain.UserChangedEvent.UserChangedEventAction;
import dev.kurama.support.ServiceLayerIntegrationTestConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;

@ServiceLayerIntegrationTestConfig
@Import({TicTacToePlayerEventListener.class, TicTacToePlayerService.class})
class TicTacToePlayerEventListenerIT {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private ApplicationEventPublisher applicationEventPublisher;

  User user;

  @BeforeEach
  void setUp() {
    Role role = entityManager.persist(Role.builder().setRandomUUID().name(randomAlphanumeric(8)).build());
    user = entityManager.persist(User.builder().setRandomUUID().username(randomAlphanumeric(8)).role(role).build());
  }

  @Test
  void should_create_a_ttt_user_on_user_created_event() {
    UserChangedEvent event = UserChangedEvent.builder()
      .userId(user.getId())
      .username(user.getUsername())
      .action(UserChangedEventAction.CREATED)
      .build();

    applicationEventPublisher.publishEvent(event);
    TicTacToePlayer player = entityManager.find(TicTacToePlayer.class, event.getUserId());

    assertNotNull(player);
    assertEquals(event.getUserId(), player.getId());
    assertEquals(event.getUsername(), player.getUsername());
    assertEquals(0, player.getWins());
    assertEquals(0, player.getLosses());
    assertEquals(0, player.getDraws());
  }

}
