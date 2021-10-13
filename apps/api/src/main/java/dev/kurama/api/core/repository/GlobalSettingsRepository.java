package dev.kurama.api.core.repository;

import dev.kurama.api.core.domain.GlobalSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GlobalSettingsRepository extends JpaRepository<GlobalSettings, Long> {

  GlobalSettings findFirstBy();
}
