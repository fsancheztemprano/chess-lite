package dev.kurama.api.ttt.player;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.ttt.player.TicTacToePlayer.Token;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToePlayerServiceTest {

  @InjectMocks
  private TicTacToePlayerService service;

  @Mock
  private TicTacToePlayerRepository repository;

  TicTacToePlayer playerX = TicTacToePlayer.builder()
    .setRandomUUID()
    .username("user-1")
    .wins(0)
    .losses(0)
    .draws(0)
    .build();

  TicTacToePlayer playerO = TicTacToePlayer.builder()
    .setRandomUUID()
    .username("user-2")
    .wins(0)
    .losses(0)
    .draws(0)
    .build();

  @Test
  void test_exists_by_id() {
    when(repository.existsById(any())).thenReturn(false);
    when(repository.existsById(playerX.getId())).thenReturn(true);

    assertTrue(service.existsById(playerX.getId()));
    assertFalse(service.existsById("non-existing-id"));
  }

  @Test
  void test_get_player_by_username() {
    when(repository.findByUserUsername(any())).thenReturn(Optional.empty());
    when(repository.findByUserUsername(playerX.getUsername())).thenReturn(Optional.of(playerX));

    assertTrue(service.getPlayerByUsername(playerX.getUsername()).isPresent());
    assertEquals(playerX, service.getPlayerByUsername(playerX.getUsername()).get());
    assertTrue(service.getPlayerByUsername("non-existing-username").isEmpty());
  }

  @Test
  void test_find_players() {
    when(repository.findAllByUser_UsernameLike(any())).thenReturn(List.of());
    when(repository.findAllByUser_UsernameLike("%" + playerX.getUsername() + "%")).thenReturn(List.of(playerX));

    assertThat(service.findPlayers(playerX.getUsername()), hasSize(1));
    assertThat(service.findPlayers(playerX.getUsername()), hasItem(playerX));
    assertThat(service.findPlayers("non-existing-username"), hasSize(0));
  }

  @Test
  void test_create() {
    service.create(playerX.getId(), playerX.getUsername());

    ArgumentCaptor<TicTacToePlayer> argument = ArgumentCaptor.forClass(TicTacToePlayer.class);
    verify(repository).save(argument.capture());

    TicTacToePlayer capturedPlayer = argument.getValue();
    assertEquals(playerX.getId(), capturedPlayer.getId());
    assertEquals(playerX.getId(), capturedPlayer.getUser().getId());
    assertEquals(playerX.getUsername(), capturedPlayer.getUsername());
    assertEquals(0, capturedPlayer.getWins());
    assertEquals(0, capturedPlayer.getLosses());
    assertEquals(0, capturedPlayer.getDraws());
  }

  @Test
  void test_register_game_result_win_o() {
    service.registerGameResult(playerX, playerO, TicTacToePlayer.Token.X);

    ArgumentCaptor<List<TicTacToePlayer>> argument = ArgumentCaptor.forClass(List.class);
    verify(repository).saveAll(argument.capture());

    List<TicTacToePlayer> capturedPlayers = argument.getValue();
    assertEquals(2, capturedPlayers.size());
    assertEquals(playerX.getId(), capturedPlayers.get(0).getId());
    assertEquals(playerX.getUsername(), capturedPlayers.get(0).getUsername());
    assertEquals(1, capturedPlayers.get(0).getWins());
    assertEquals(0, capturedPlayers.get(0).getLosses());
    assertEquals(0, capturedPlayers.get(0).getDraws());
    assertEquals(playerO.getId(), capturedPlayers.get(1).getId());
    assertEquals(playerO.getUsername(), capturedPlayers.get(1).getUsername());
    assertEquals(0, capturedPlayers.get(1).getWins());
    assertEquals(1, capturedPlayers.get(1).getLosses());
    assertEquals(0, capturedPlayers.get(1).getDraws());
  }

  @Test
  void test_register_game_result_win_x() {
    service.registerGameResult(playerX, playerO, TicTacToePlayer.Token.O);

    ArgumentCaptor<List<TicTacToePlayer>> argument = ArgumentCaptor.forClass(List.class);
    verify(repository).saveAll(argument.capture());

    List<TicTacToePlayer> capturedPlayers = argument.getValue();
    assertEquals(2, capturedPlayers.size());
    assertEquals(playerX.getId(), capturedPlayers.get(0).getId());
    assertEquals(playerX.getUsername(), capturedPlayers.get(0).getUsername());
    assertEquals(0, capturedPlayers.get(0).getWins());
    assertEquals(1, capturedPlayers.get(0).getLosses());
    assertEquals(0, capturedPlayers.get(0).getDraws());
    assertEquals(playerO.getId(), capturedPlayers.get(1).getId());
    assertEquals(playerO.getUsername(), capturedPlayers.get(1).getUsername());
    assertEquals(1, capturedPlayers.get(1).getWins());
    assertEquals(0, capturedPlayers.get(1).getLosses());
    assertEquals(0, capturedPlayers.get(1).getDraws());
  }

  @Test
  void test_register_game_result_draw() {
    service.registerGameResult(playerX, playerO, Token.NONE);

    ArgumentCaptor<List<TicTacToePlayer>> argument = ArgumentCaptor.forClass(List.class);
    verify(repository).saveAll(argument.capture());

    List<TicTacToePlayer> capturedPlayers = argument.getValue();
    assertEquals(2, capturedPlayers.size());
    assertEquals(playerX.getId(), capturedPlayers.get(0).getId());
    assertEquals(playerX.getUsername(), capturedPlayers.get(0).getUsername());
    assertEquals(0, capturedPlayers.get(0).getWins());
    assertEquals(0, capturedPlayers.get(0).getLosses());
    assertEquals(1, capturedPlayers.get(0).getDraws());
    assertEquals(playerO.getId(), capturedPlayers.get(1).getId());
    assertEquals(playerO.getUsername(), capturedPlayers.get(1).getUsername());
    assertEquals(0, capturedPlayers.get(1).getWins());
    assertEquals(0, capturedPlayers.get(1).getLosses());
    assertEquals(1, capturedPlayers.get(1).getDraws());
  }

}
