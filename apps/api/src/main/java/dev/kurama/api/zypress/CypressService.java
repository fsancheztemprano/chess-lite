package dev.kurama.api.zypress;

import dev.kurama.api.core.exception.domain.exists.UserExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.hateoas.input.ThemeUpdateInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.repository.AuthorityRepository;
import dev.kurama.api.core.repository.GlobalSettingsRepository;
import dev.kurama.api.core.repository.RoleRepository;
import dev.kurama.api.core.repository.ThemeRepository;
import dev.kurama.api.core.repository.UserRepository;
import dev.kurama.api.core.service.DataInitializationService;
import dev.kurama.api.core.service.GlobalSettingsService;
import dev.kurama.api.core.service.RoleService;
import dev.kurama.api.core.service.ThemeService;
import dev.kurama.api.core.service.UserService;
import dev.kurama.api.ttt.game.TicTacToeGameService;
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
  private final UserService userService;
  @NonNull
  private final RoleService roleService;
  @NonNull
  private final RoleRepository roleRepository;
  @NonNull
  private final AuthorityRepository authorityRepository;
  @NonNull
  private final GlobalSettingsRepository globalSettingsRepository;
  @NonNull
  private final GlobalSettingsService globalSettingsService;
  @NonNull
  private final ThemeService themeService;
  @NonNull
  private final ThemeRepository themeRepository;
  @NonNull
  private final TicTacToeGameService ticTacToeGameService;

  @NonNull
  private final DataInitializationService initializationService;

  @PostConstruct
  public void init() {
    setState0();
  }

  private CypressState state = CypressState.STATE_0;

  public CypressDTO getState() {
    return CypressDTO.builder().state(state).build();
  }

  public void setState(CypressState state) {
    try {
      switch (state) {
        case STATE_0:
          setState0();
          break;
        case STATE_1:
          setState0();
          setState1();
          break;
        default:
          break;
      }
      this.state = state;
      log.atFine().log("Cypress State: %s", this.state);
    } catch (Exception e) {
      log.atWarning().withCause(e).log("Cypress State: %s", this.state);
    }
  }

  private void setState0() {
    themeRepository.deleteAll();
    globalSettingsRepository.deleteAll();
    userRepository.deleteAll();
    roleRepository.deleteAll();
    authorityRepository.deleteAll();
  }

  private void setState1() throws UserExistsException, RoleNotFoundException {
    initializationService.initialize();
    createUser("e2e-user1");
    createUser("e2e-user2");
    roleService.findByName("USER_ROLE").ifPresent(role -> {
      role.setCanLogin(true);
      roleRepository.save(role);
    });
    globalSettingsService.updateGlobalSettings(GlobalSettingsUpdateInput.builder().signupOpen(true).build());
    themeService.updateTheme(
      ThemeUpdateInput.builder().primaryColor("#303f9f").accentColor("#f9a825").warnColor("#c2185b").build());
  }

  private void createUser(String username) {
    userService.createUser(
      UserInput.builder().username(username).password(username).email(username + "@localhost").locked(false).build());
  }
}
