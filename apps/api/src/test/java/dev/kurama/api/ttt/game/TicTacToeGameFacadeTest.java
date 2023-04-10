package dev.kurama.api.ttt.game;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.input.TicTacToeGameFilterInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameStatusInput;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.PagedModel.PageMetadata;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TicTacToeGameFacadeTest {

  @InjectMocks
  private TicTacToeGameFacade facade;

  @Mock
  private TicTacToeGameService service;

  @Mock
  private TicTacToeGameMapper mapper;

  @Mock
  private TicTacToeGameModelAssembler assembler;

  TicTacToePlayer playerX = TicTacToePlayer.builder().setRandomUUID().username("user-1").build();
  TicTacToePlayer playerO = TicTacToePlayer.builder().setRandomUUID().username("user-2").build();
  TicTacToeGame game = TicTacToeGame.builder()
    .setRandomUUID()
    .playerX(playerX)
    .playerO(playerO)
    .status(Status.PENDING)
    .lastActivityAt(LocalDateTime.now())
    .requestedAt(LocalDateTime.now())
    .build();
  TicTacToeGameModel model = TicTacToeGameModel.builder().build();

  @Test
  void should_create_game() {
    TicTacToeGameInput input = TicTacToeGameInput.builder().playerOUsername("user-2").build();

    when(service.create(input)).thenReturn(game);
    when(mapper.ticTacToeGameToTicTacToeGameModel(game)).thenReturn(model);

    assertEquals(facade.create(input), model);
  }

  @Test
  void should_find_game_by_id() {
    when(service.findById(game.getId())).thenReturn(game);
    when(mapper.ticTacToeGameToTicTacToeGameModel(game)).thenReturn(model);

    assertEquals(facade.findById(game.getId()), model);
  }

  @Test
  void should_update_game_status() {
    TicTacToeGameStatusInput input = TicTacToeGameStatusInput.builder().status(Status.IN_PROGRESS.toString()).build();

    when(service.updateStatus(game.getId(), input)).thenReturn(game);
    when(mapper.ticTacToeGameToTicTacToeGameModel(game)).thenReturn(model);

    assertEquals(facade.updateStatus(game.getId(), input), model);
  }

  @Test
  void should_get_all_games() {
    Pageable pageable = PageRequest.of(0, 10);
    TicTacToeGameFilterInput filter = TicTacToeGameFilterInput.builder().build();
    PageImpl<TicTacToeGame> page = new PageImpl<>(List.of(game));
    PageImpl<TicTacToeGameModel> modelPage = new PageImpl<>(List.of(model));
    PagedModel<TicTacToeGameModel> pagedModel = PagedModel.of(List.of(this.model), new PageMetadata(1, 0, 10));

    when(service.getAll(pageable, filter)).thenReturn(page);
    when(mapper.ticTacToeGamePageToTicTacToeGameModelPage(page)).thenReturn(modelPage);
    when(assembler.toPagedModel(modelPage)).thenReturn(pagedModel);

    assertEquals(facade.getAll(pageable, filter), pagedModel);
  }

}
