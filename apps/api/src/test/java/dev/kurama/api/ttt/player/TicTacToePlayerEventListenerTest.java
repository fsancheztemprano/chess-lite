package dev.kurama.api.ttt.player;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.event.domain.UserChangedEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToePlayerEventListenerTest {

  @InjectMocks
  private TicTacToePlayerEventListener listener;

  @Mock
  private TicTacToePlayerService service;

  @Test
  void should_create_tic_tac_toe_player_when_user_created() {
    UserChangedEvent event = UserChangedEvent.builder()
      .userId("userId")
      .username("username")
      .action(UserChangedEvent.UserChangedEventAction.CREATED)
      .build();

    when(service.existsById(event.getUserId())).thenReturn(false);

    listener.userChangedEvent(event);

    verify(service).create(event.getUserId(), event.getUsername());
  }

  @Test
  void should_not_create_tic_tac_toe_player_when_user_already_exists() {
    UserChangedEvent event = UserChangedEvent.builder()
      .userId("userId")
      .username("username")
      .action(UserChangedEvent.UserChangedEventAction.CREATED)
      .build();

    when(service.existsById(event.getUserId())).thenReturn(true);

    listener.userChangedEvent(event);

    verify(service, never()).create(any(), any());
  }

  @Test
  void should_not_create_tic_tac_toe_player_when_user_updated() {
    UserChangedEvent event = UserChangedEvent.builder()
      .userId("userId")
      .username("username")
      .action(UserChangedEvent.UserChangedEventAction.UPDATED)
      .build();

    when(service.existsById(event.getUserId())).thenReturn(false);

    listener.userChangedEvent(event);

    verifyNoInteractions(service);
  }

  @Test
  void should_not_create_tic_tac_toe_player_when_user_deleted() {
    UserChangedEvent event = UserChangedEvent.builder()
      .userId("userId")
      .username("username")
      .action(UserChangedEvent.UserChangedEventAction.DELETED)
      .build();

    when(service.existsById(event.getUserId())).thenReturn(false);

    listener.userChangedEvent(event);

    verifyNoInteractions(service);
  }


}
