package dev.kurama.api.pact;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.RoleExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.repository.AuthorityRepository;
import dev.kurama.api.pact.AuthorityControllerBase.AuthorityControllerBaseDataLoader;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Import;

@Import(AuthorityControllerBaseDataLoader.class)
@EnableAutoConfiguration()
public abstract class AuthorityControllerBase extends PactBase {

  @Autowired
  private AuthorityControllerBaseDataLoader dataLoader;

  @Override
  @BeforeEach
  void setUp() throws Exception {
    super.setUp();
    dataLoader.initialize();
  }

  @RequiredArgsConstructor
  public static class AuthorityControllerBaseDataLoader extends PactDataLoader {

    @NonNull
    private final AuthorityRepository authorityRepository;

    @Override
    protected String getName() {
      return "Authority Controller";
    }

    @Override
    protected boolean isInitialized() {
      return super.isInitialized() && authorityRepository.existsById("authorityId");
    }

    @Override
    protected void initialization()
      throws RoleNotFoundException, ImmutableRoleException, RoleExistsException, UsernameExistsException,
      EmailExistsException, ActivationTokenRecentException {
      super.initialization();

      createAuthority();
    }

    private void createAuthority() {
      authorityRepository.saveAndFlush(Authority.builder().id("authorityId").name("pact:test:read").build());
    }
  }
}
