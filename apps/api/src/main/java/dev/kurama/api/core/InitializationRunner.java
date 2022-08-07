package dev.kurama.api.core;

import dev.kurama.api.core.service.DataInitializationService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.flogger.Flogger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Flogger
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class InitializationRunner implements CommandLineRunner {

  @Value("${application.run_data_init}")
  private boolean dataInit;

  @NonNull
  private final DataInitializationService initializationService;

  @SneakyThrows
  @Override
  public void run(String... args) {
    if (dataInit) {
      initializationService.initialize();
    }
  }
}
