package dev.kurama.api.ttt.root;

import static dev.kurama.api.ttt.core.TicTacToeConstant.TIC_TAC_TOE_BASE_PATH;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.hateoas.root.model.RootResource;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@PreAuthorize("hasAuthority(@TicTacToeAuthority.TIC_TAC_TOE_ROOT)")
@RestController
@RequestMapping(TIC_TAC_TOE_BASE_PATH)
@RequiredArgsConstructor
public class TicTacToeRootController {

  @NonNull
  private final TicTacToeRootResourceAssembler assembler;

  @GetMapping()
  public ResponseEntity<RepresentationModel<RootResource>> root() {
    return ok(assembler.assemble());
  }

}
