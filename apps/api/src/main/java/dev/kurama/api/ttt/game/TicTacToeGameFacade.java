package dev.kurama.api.ttt.game;

import dev.kurama.api.ttt.game.input.TicTacToeGameInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameStatusInput;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedModel;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicTacToeGameFacade {

  @NonNull
  private final TicTacToeGameService service;

  @NonNull
  private final TicTacToeGameMapper mapper;

  @NonNull
  private final TicTacToeGameModelAssembler assembler;

  public TicTacToeGameModel create(TicTacToeGameInput input) {
    return mapper.ticTacToeGameToTicTacToeGameModel(service.create(input));
  }

  public TicTacToeGameModel findById(String gameId) {
    return mapper.ticTacToeGameToTicTacToeGameModel(service.findById(gameId));
  }

  public TicTacToeGameModel updateStatus(String gameId, TicTacToeGameStatusInput input) {
    return mapper.ticTacToeGameToTicTacToeGameModel(service.updateStatus(gameId, input));
  }

  public PagedModel<TicTacToeGameModel> getAll(Pageable pageable) {
    return assembler.toPagedModel(mapper.ticTacToeGamePageToTicTacToeGameModelPage(service.getAll(pageable)));
  }
}
