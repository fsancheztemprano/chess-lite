package dev.kurama.api.core.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import static dev.kurama.api.core.constant.RestPathConstant.*;

@RequestMapping()
@RequiredArgsConstructor
@RestController
public class ApplicationForwardController {

  @RequestMapping(path = {
    ROOT_URL,
    APP_URL,
    "/app/{path:(?!index\\.html$|favicon\\.ico$|main\\..+\\.js$|polyfills\\..+\\.js$|runtime\\..+\\.js$|styles\\..+\\.css$|common\\..+\\.js$|[0-9]{1,4}\\..+\\.js$|assets).*}/**"
  })
  public ModelAndView forwardApp() {
    return new ModelAndView("forward:" + INDEX_URL);
  }
}
