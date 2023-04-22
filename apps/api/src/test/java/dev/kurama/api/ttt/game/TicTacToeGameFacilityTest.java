package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.utility.AuthorityUtils.setContextUser;
import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.api.core.filter.ContextUser;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.input.TicTacToeGameInput;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import dev.kurama.api.ttt.player.TicTacToePlayerService;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToeGameFacilityTest {


  @InjectMocks
  private TicTacToeGameFacility facility;

  @Mock
  private TicTacToeGameService gameService;

  @Mock
  private TicTacToePlayerService playerService;

  @Nested
  class CreateGameTests {

    TicTacToeGame expected = TicTacToeGame.builder()
      .setRandomUUID()
      .status(Status.PENDING)
      .lastActivityAt(LocalDateTime.now())
      .requestedAt(LocalDateTime.now())
      .build();

    TicTacToePlayer playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
    TicTacToePlayer playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();

    @Test
    void should_create_game() {
      setContextUser(ContextUser.builder().build(), TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE);

      TicTacToeGameInput input = TicTacToeGameInput.builder()
        .playerXUsername(playerX.getUsername())
        .playerOUsername(playerO.getUsername())
        .isPrivate(true)
        .build();

      when(playerService.getPlayerByUsername(playerX.getUsername())).thenReturn(Optional.of(playerX));
      when(playerService.getPlayerByUsername(playerO.getUsername())).thenReturn(Optional.of(playerO));
      when(gameService.create(input, playerX, playerO)).thenReturn(expected);

      TicTacToeGame actual = facility.create(input);

      assertEquals(expected, actual);
    }

    @Test
    void should_set_player_x_to_current_user() {
      setContextUser(ContextUser.builder().username(playerX.getUsername()).build());
      TicTacToeGameInput input = TicTacToeGameInput.builder().playerOUsername(playerO.getUsername()).build();

      when(playerService.getPlayerByUsername(playerX.getUsername())).thenReturn(Optional.of(playerX));
      when(playerService.getPlayerByUsername(playerO.getUsername())).thenReturn(Optional.of(playerO));
      when(gameService.create(input, playerX, playerO)).thenReturn(expected);

      TicTacToeGame actual = facility.create(input);

      assertEquals(expected, actual);
    }

    @Test
    void should_throw_if_both_users_are_the_same() {
      setContextUser(ContextUser.builder().username(playerX.getUsername()).build());
      TicTacToeGameInput input = TicTacToeGameInput.builder()
        .playerXUsername(playerX.getUsername())
        .playerOUsername(playerX.getUsername())
        .build();

      when(playerService.getPlayerByUsername(playerX.getUsername())).thenReturn(Optional.of(playerX));
      when(playerService.getPlayerByUsername(playerO.getUsername())).thenReturn(Optional.of(playerO));

      assertThrows(IllegalArgumentException.class, () -> facility.create(input));

      verify(gameService, never()).create(any(), any(), any());
    }

    @Test
    void should_throw_if_player_is_not_found() {
      setContextUser(ContextUser.builder().username(playerX.getUsername()).build());
      TicTacToeGameInput input = TicTacToeGameInput.builder()
        .playerXUsername(playerX.getUsername())
        .playerOUsername(playerO.getUsername())
        .build();

      when(playerService.getPlayerByUsername(playerX.getUsername())).thenReturn(Optional.of(playerX));
      when(playerService.getPlayerByUsername(playerO.getUsername())).thenReturn(Optional.empty());

      assertThrows(EntityNotFoundException.class, () -> facility.create(input));

      when(playerService.getPlayerByUsername(playerX.getUsername())).thenReturn(Optional.empty());
      assertThrows(EntityNotFoundException.class, () -> facility.create(input));

      verify(gameService, never()).create(any(), any(), any());
    }
  }
}
