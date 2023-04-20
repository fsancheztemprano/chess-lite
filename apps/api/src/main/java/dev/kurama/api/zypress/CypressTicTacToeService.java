package dev.kurama.api.zypress;

import static dev.kurama.api.core.utility.AuthorityUtils.setContextUser;

import dev.kurama.api.core.filter.ContextUser;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.game.TicTacToeGameFacility;
import dev.kurama.api.ttt.game.TicTacToeGameService;
import dev.kurama.api.ttt.game.input.TicTacToeGameInput;
import dev.kurama.api.ttt.game.input.TicTacToeGameStatusInput;
import dev.kurama.api.ttt.move.TicTacToeGameMoveFacility;
import dev.kurama.api.ttt.move.TicTacToeGameMoveInput;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Profile({"e2e"})
@Service
public class CypressTicTacToeService {

  @NonNull
  private final TicTacToeGameService service;

  @NonNull
  private final TicTacToeGameFacility facility;

  @NonNull
  private final TicTacToeGameMoveFacility moveFacility;

  public void setStateTicTacToe() {
    setContextUser(ContextUser.builder().id("admin").username("admin").build(),
      TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE, TicTacToeAuthority.TIC_TAC_TOE_GAME_MOVE);

    facility.create(TicTacToeGameInput.builder().playerXUsername("e2e-user1").playerOUsername("e2e-user2").build());

    TicTacToeGame game2 = facility.create(
      TicTacToeGameInput.builder().playerXUsername("e2e-user1").playerOUsername("e2e-user3").build());
    service.updateStatus(game2.getId(),
      TicTacToeGameStatusInput.builder().status(Status.IN_PROGRESS.toString()).build());
    moveFacility.move(game2.getId(), TicTacToeGameMoveInput.builder().cell("A1").build());
    moveFacility.move(game2.getId(), TicTacToeGameMoveInput.builder().cell("A2").build());

    TicTacToeGame game3 = facility.create(
      TicTacToeGameInput.builder().playerXUsername("e2e-user1").playerOUsername("e2e-user4").isPrivate(true).build());
    service.updateStatus(game3.getId(), TicTacToeGameStatusInput.builder().status(Status.REJECTED.toString()).build());

    TicTacToeGame game4 = facility.create(
      TicTacToeGameInput.builder().playerXUsername("e2e-user1").playerOUsername("e2e-user5").isPrivate(true).build());
    service.updateStatus(game4.getId(),
      TicTacToeGameStatusInput.builder().status(Status.IN_PROGRESS.toString()).build());
    moveFacility.move(game4.getId(), TicTacToeGameMoveInput.builder().cell("A1").build());
    moveFacility.move(game4.getId(), TicTacToeGameMoveInput.builder().cell("A2").build());
    moveFacility.move(game4.getId(), TicTacToeGameMoveInput.builder().cell("B2").build());
    moveFacility.move(game4.getId(), TicTacToeGameMoveInput.builder().cell("C2").build());
    moveFacility.move(game4.getId(), TicTacToeGameMoveInput.builder().cell("C3").build());

    TicTacToeGame game5 = facility.create(
      TicTacToeGameInput.builder().playerXUsername("e2e-user2").playerOUsername("e2e-user3").isPrivate(false).build());
    service.updateStatus(game5.getId(),
      TicTacToeGameStatusInput.builder().status(Status.IN_PROGRESS.toString()).build());
    moveFacility.move(game5.getId(), TicTacToeGameMoveInput.builder().cell("A1").build());
    moveFacility.move(game5.getId(), TicTacToeGameMoveInput.builder().cell("A2").build());

    TicTacToeGame game6 = facility.create(
      TicTacToeGameInput.builder().playerXUsername("e2e-user2").playerOUsername("e2e-user4").isPrivate(true).build());
    service.updateStatus(game6.getId(), TicTacToeGameStatusInput.builder().status(Status.REJECTED.toString()).build());
  }

}
