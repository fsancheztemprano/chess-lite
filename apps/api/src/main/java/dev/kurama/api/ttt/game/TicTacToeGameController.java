package dev.kurama.api.ttt.game;

import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_GAMES_PATH;
import static org.springframework.beans.support.PagedListHolder.DEFAULT_PAGE_SIZE;
import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.api.ttt.game.input.TicTacToeGameInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameStatusInput;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(TIC_TAC_TOE_GAMES_PATH)
@PreAuthorize("hasAuthority(@TicTacToeAuthority.TIC_TAC_TOE_ROOT)")
@RequiredArgsConstructor
public class TicTacToeGameController {

  @NonNull
  private final TicTacToeGameFacade ticTacToeGameFacade;

  @PostMapping()
  public ResponseEntity<TicTacToeGameModel> create(@RequestBody TicTacToeGameInput input) {
    TicTacToeGameModel gameModel = ticTacToeGameFacade.create(input);
    return created(fromCurrentRequestUri().path("/{userId}").buildAndExpand(gameModel.getId()).toUri()).body(gameModel);
  }

  @GetMapping()
  public ResponseEntity<PagedModel<TicTacToeGameModel>> getAll(@PageableDefault(page = 0, size = DEFAULT_PAGE_SIZE) Pageable pageable,
                                                               @RequestParam(value = "myGames", required = false) Boolean myGames,
                                                               @RequestParam(value = "player", required = false) String player,
                                                               @RequestParam(value = "status", required = false) String status) {
    return ok().body(ticTacToeGameFacade.getAll(pageable));
  }

  @GetMapping("/{gameId}")
  public ResponseEntity<TicTacToeGameModel> get(@PathVariable("gameId") String gameId) {
    return ok().body(ticTacToeGameFacade.findById(gameId));
  }

  @PatchMapping("/{gameId}")
  public ResponseEntity<TicTacToeGameModel> status(@PathVariable String gameId,
                                                   @NonNull @RequestBody TicTacToeGameStatusInput input) {
    return ok().body(ticTacToeGameFacade.updateStatus(gameId, input));
  }

}
