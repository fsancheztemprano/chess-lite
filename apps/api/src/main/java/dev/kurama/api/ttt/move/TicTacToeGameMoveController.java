package dev.kurama.api.ttt.move;

import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAME_MOVE_PATH;
import static org.springframework.http.ResponseEntity.created;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.api.ttt.game.TicTacToeGameModel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(TIC_TAC_TOE_GAME_MOVE_PATH)
@RequiredArgsConstructor
public class TicTacToeGameMoveController {

  @NonNull
  private final TicTacToeGameMoveFacade ticTacToeGameMoveFacade;

  @PreAuthorize("hasAuthority(@TicTacToeAuthority.TIC_TAC_TOE_ROOT)")
  @PostMapping()
  public ResponseEntity<TicTacToeGameModel> move(@RequestBody TicTacToeGameMoveInput input,
                                                 @PathVariable String gameId) {
    TicTacToeGameModel gameMoveModel = ticTacToeGameMoveFacade.move(gameId, input);
    return created(fromCurrentRequestUri().path("/{moveId}").buildAndExpand(gameMoveModel.getId()).toUri()).body(
      gameMoveModel);
  }


}
