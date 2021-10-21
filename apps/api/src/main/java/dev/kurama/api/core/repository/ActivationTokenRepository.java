package dev.kurama.api.core.repository;

import dev.kurama.api.core.domain.ActivationToken;
import dev.kurama.api.core.domain.User;
import java.util.Optional;
import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;

public interface ActivationTokenRepository extends CrudRepository<ActivationToken, String> {

  Optional<ActivationToken> findActivationTokenByUser(@NonNull User user);

  void deleteAllByUser(@NonNull User user);

  Integer countActivationTokenByUser(@NonNull User user);


}
