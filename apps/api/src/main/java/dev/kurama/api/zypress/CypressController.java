package dev.kurama.api.zypress;

import static dev.kurama.api.core.constant.RestPathConstant.BASE_PATH;
import static org.springframework.http.ResponseEntity.ok;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@Profile({"e2e"})
@RestController
@RequestMapping(BASE_PATH + "/cypress")
public class CypressController {

  @NonNull
  private final CypressService cypressService;

  @GetMapping()
  public ResponseEntity<CypressDTO> getCurrentState() {
    return ok().body(cypressService.getState());
  }

  @PostMapping("/{state}")
  public ResponseEntity<CypressDTO> setCypressState(@PathVariable("state") String state) {
    cypressService.setState(CypressState.valueOf(state));
    return ok().body(cypressService.getState());
  }
}
