package dev.kurama.api.core.configuration.development.halexplorer;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.RedirectView;

@Profile({"development"})
@Controller
@RequestMapping("/explorer")
public class HalExplorerRedirection {

  @GetMapping()
  public RedirectView redirectToExplorer() {
    return new RedirectView("/explorer/index.html#uri=/api");
  }
}
