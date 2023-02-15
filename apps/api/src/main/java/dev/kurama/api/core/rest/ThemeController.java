package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.THEME_PATH;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.facade.ThemeFacade;
import dev.kurama.api.core.hateoas.input.ThemeUpdateInput;
import dev.kurama.api.core.hateoas.model.ThemeModel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping(THEME_PATH)
public class ThemeController {

  @NonNull
  private final ThemeFacade themeFacade;

  @GetMapping()
  public ResponseEntity<ThemeModel> get() {
    return ok().body(themeFacade.getTheme());
  }

  @PatchMapping()
  @PreAuthorize("hasAuthority(@ThemeAuthority.THEME_UPDATE)")
  public ResponseEntity<ThemeModel> update(@RequestBody ThemeUpdateInput themeUpdateInput) {
    return ok().body(themeFacade.updateTheme(themeUpdateInput));
  }

}
