package dev.kurama.api.core.repository;

import dev.kurama.api.core.domain.ActivationToken;
import org.springframework.data.repository.CrudRepository;

public interface ActivationTokenRepository extends CrudRepository<ActivationToken, String> {

}
