package dev.kurama.api.ttt.player;

import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_PLAYER_PATH;
import static org.springframework.http.ResponseEntity.ok;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(TIC_TAC_TOE_PLAYER_PATH)
@PreAuthorize("hasAuthority(@TicTacToeAuthority.TIC_TAC_TOE_ROOT)")
@RequiredArgsConstructor
public class TicTacToePlayerController {

  @NonNull
  private final TicTacToePlayerFacade facade;


  @GetMapping()
  public ResponseEntity<CollectionModel<TicTacToePlayerModel>> findPlayers(@RequestParam(value = "username",
                                                                                         required = false) String username) {
    return ok().body(facade.findPlayers(username));
  }

}
