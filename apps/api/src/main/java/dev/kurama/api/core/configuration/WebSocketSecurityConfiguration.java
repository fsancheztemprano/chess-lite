package dev.kurama.api.core.configuration;

import dev.kurama.api.core.authority.GlobalSettingsAuthority;
import dev.kurama.api.core.authority.RoleAuthority;
import dev.kurama.api.core.authority.UserAuthority;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfiguration extends AbstractSecurityWebSocketMessageBrokerConfigurer {

  @Override
  protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
    messages.simpTypeMatchers(SimpMessageType.CONNECT, SimpMessageType.CONNECT_ACK, SimpMessageType.DISCONNECT_ACK,
        SimpMessageType.DISCONNECT, SimpMessageType.UNSUBSCRIBE, SimpMessageType.HEARTBEAT)
      .permitAll()
      .simpSubscribeDestMatchers("/ami/user")
      .hasAuthority(UserAuthority.USER_READ)
      .simpSubscribeDestMatchers("/ami/user/**")
      .hasAuthority(UserAuthority.PROFILE_READ)
      .simpSubscribeDestMatchers("/ami/user-preferences/**")
      .hasAuthority(UserAuthority.PROFILE_READ)
      .simpSubscribeDestMatchers("/ami/role/**")
      .hasAuthority(RoleAuthority.ROLE_READ)
      .simpSubscribeDestMatchers("/ami/global-settings")
      .hasAuthority(GlobalSettingsAuthority.GLOBAL_SETTINGS_READ)
      .anyMessage()
      .authenticated();
  }

  @Override
  protected boolean sameOriginDisabled() {
    return true;
  }
}
