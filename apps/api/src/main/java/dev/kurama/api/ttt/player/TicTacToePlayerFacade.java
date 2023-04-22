package dev.kurama.api.ttt.player;

import javax.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicTacToePlayerFacade {

  @NotNull
  private final TicTacToePlayerService service;

  @NotNull
  private final TicTacToePlayerMapper mapper;

  @NotNull
  private final TicTacToePlayerModelAssembler assembler;

  public CollectionModel<TicTacToePlayerModel> findPlayers(String username) {
    return assembler.toCollectionModel(mapper.ticTacToePlayersToTicTacToePlayerModels(service.findPlayers(username)));
  }
}
