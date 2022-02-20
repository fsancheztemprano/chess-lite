package dev.kurama.api.core.configuration;

import com.auth0.jwt.interfaces.DecodedJWT;
import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.utility.JWTTokenProvider;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

  @NonNull
  private final JWTTokenProvider jwtTokenProvider;

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/ami");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/websocket").withSockJS();
  }

  @Override
  public void configureClientInboundChannel(ChannelRegistration registration) {
    registration.interceptors(new ChannelInterceptor() {
      @Override
      public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        List<String> tokenList = accessor.getNativeHeader("Authorization");
        String authorizationHeader = null;
        if (tokenList == null || tokenList.isEmpty()) {
          return message;
        } else {
          authorizationHeader = tokenList.get(0);
          if (authorizationHeader == null) {
            return message;
          }
        }
        var token = authorizationHeader.substring(SecurityConstant.TOKEN_PREFIX.length());
        DecodedJWT decodedToken = jwtTokenProvider.getDecodedJWT(token);
        accessor.setUser(jwtTokenProvider.getUsernamePasswordAuthenticationToken(decodedToken));
        return message;
      }
    });
  }
}
