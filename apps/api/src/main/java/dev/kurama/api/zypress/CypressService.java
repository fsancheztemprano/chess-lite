package dev.kurama.api.zypress;

import dev.kurama.api.core.repository.AuthorityRepository;
import dev.kurama.api.core.repository.GlobalSettingsRepository;
import dev.kurama.api.core.repository.RoleRepository;
import dev.kurama.api.core.repository.UserRepository;
import dev.kurama.api.core.service.DataInitializationService;
import javax.annotation.PostConstruct;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Flogger
@RequiredArgsConstructor
@Profile({"e2e"})
@Service
public class CypressService {


  @NonNull
  private final UserRepository userRepository;
  @NonNull
  private final RoleRepository roleRepository;
  @NonNull
  private final AuthorityRepository authorityRepository;
  @NonNull
  private final GlobalSettingsRepository globalSettingsRepository;

  @NonNull
  private final DataInitializationService initializationService;

  @PostConstruct
  public void init() {
    _state0();
  }

  private CypressState state = CypressState.STATE_0;

  public CypressDTO getState() {
    return CypressDTO.builder().state(state).build();
  }

  public void setState(CypressState state) {
    switch (state) {
      case STATE_0:
        _state0();
        break;
      case STATE_1:
        _state0();
        _state1();
        break;
      default:
        break;
    }
    this.state = state;
    log.atInfo().log("Cypress State: %s", this.state);
  }

  private void _state0() {
    globalSettingsRepository.deleteAll();
    userRepository.deleteAll();
    roleRepository.deleteAll();
    authorityRepository.deleteAll();
  }

  private void _state1() {
    initializationService.initialize();
  }
}
