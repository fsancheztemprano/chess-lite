package dev.kurama.api.pact;

import dev.kurama.api.ttt.root.TicTacToeRootController;
import dev.kurama.api.ttt.root.TicTacToeRootResourceAssembler;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;

@WebMvcTest(controllers = TicTacToeRootController.class)
@Import({TicTacToeRootResourceAssembler.class})
public abstract class TicTacToeRootControllerBase extends PactBase {

}
