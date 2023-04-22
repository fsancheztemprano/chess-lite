package dev.kurama.api.ttt.move;

import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAME_MOVE_PATH;
import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(TIC_TAC_TOE_GAME_MOVE_PATH)
@PreAuthorize("hasAuthority(@TicTacToeAuthority.TIC_TAC_TOE_ROOT)")
@RequiredArgsConstructor
public class TicTacToeGameMoveController {

  @NonNull
  private final TicTacToeGameMoveFacade facade;

  @GetMapping()
  public ResponseEntity<CollectionModel<TicTacToeGameMoveModel>> getAllGameMoves(@PathVariable String gameId) {
    return ok().body(facade.getAllGameMoves(gameId));
  }

  @PostMapping()
  public ResponseEntity<TicTacToeGameMoveModel> move(@PathVariable String gameId,
                                                     @NonNull @RequestBody TicTacToeGameMoveInput input) {
    TicTacToeGameMoveModel move = facade.move(gameId, input);
    return created(fromCurrentRequestUri().path("/{moveId}").buildAndExpand(move.getId()).toUri()).body(move);
  }
}
