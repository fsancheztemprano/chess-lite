package dev.kurama.api.core.configuration.development.swagger;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.RedirectView;

@Profile({"development"})
@Controller
@RequestMapping("/swagger-ui")
public class SwaggerRedirection {

  @GetMapping()
  public RedirectView redirectToExplorer() {
    return new RedirectView("/swagger-ui/index.html");
  }
}
