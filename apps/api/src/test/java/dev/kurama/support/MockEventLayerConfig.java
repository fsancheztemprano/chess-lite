package dev.kurama.support;

import dev.kurama.api.core.event.emitter.GlobalSettingsChangedEventEmitter;
import dev.kurama.api.core.event.emitter.RoleChangedEventEmitter;
import dev.kurama.api.core.event.emitter.UserChangedEventEmitter;
import dev.kurama.api.core.event.emitter.UserPreferencesChangedEventEmitter;
import dev.kurama.api.ttt.game.TicTacToeGameChangedEventEmitter;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class MockEventLayerConfig {

  @Bean
  @Primary
  public GlobalSettingsChangedEventEmitter GlobalSettingsChangedEventEmitter() {
    return Mockito.mock(GlobalSettingsChangedEventEmitter.class);
  }

  @Bean
  @Primary
  public RoleChangedEventEmitter RoleChangedEventEmitter() {
    return Mockito.mock(RoleChangedEventEmitter.class);
  }

  @Bean
  @Primary
  public UserChangedEventEmitter UserChangedEventEmitter() {
    return Mockito.mock(UserChangedEventEmitter.class);
  }

  @Bean
  @Primary
  public UserPreferencesChangedEventEmitter UserPreferencesChangedEventEmitter() {
    return Mockito.mock(UserPreferencesChangedEventEmitter.class);
  }

  @Bean
  @Primary
  public TicTacToeGameChangedEventEmitter TicTacToeGameChangedEventEmitter() {
    return Mockito.mock(TicTacToeGameChangedEventEmitter.class);
  }
}
