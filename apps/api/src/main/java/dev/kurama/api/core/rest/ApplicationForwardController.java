package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.APP_URL;
import static dev.kurama.api.core.constant.RestPathConstant.INDEX_URL;
import static dev.kurama.api.core.constant.RestPathConstant.ROOT_URL;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

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
