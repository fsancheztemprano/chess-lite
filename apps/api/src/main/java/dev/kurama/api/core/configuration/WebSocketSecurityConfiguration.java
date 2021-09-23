package dev.kurama.api.core.configuration;

import dev.kurama.api.core.authority.UserAuthority;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfiguration extends AbstractSecurityWebSocketMessageBrokerConfigurer {

  @Override
  protected void configureInbound(
    MessageSecurityMetadataSourceRegistry messages) {
    messages
      .simpSubscribeDestMatchers("/ami/**").authenticated()
      .simpDestMatchers("/ami/**").authenticated()
      .simpSubscribeDestMatchers("/ami/user/**").hasAuthority(UserAuthority.USER_READ)
      .anyMessage().authenticated()
    ;
  }

  @Override
  protected boolean sameOriginDisabled() {
    return true;
  }
}
