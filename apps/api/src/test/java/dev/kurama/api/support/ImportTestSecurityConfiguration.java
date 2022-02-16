package dev.kurama.api.support;

import dev.kurama.api.core.configuration.SecurityConfiguration;
import dev.kurama.api.core.filter.JWTAccessDeniedHandler;
import dev.kurama.api.core.filter.JWTAuthenticationEntryPoint;
import dev.kurama.api.core.service.UserDetailsServiceImpl;
import dev.kurama.api.core.utility.JWTTokenProvider;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <p>Declares several {@link Configuration}s to be imported to get our {@link WebMvcTest}s working.</p>
 *
 * @since 1.0.0
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Import({
  SecurityConfiguration.class,
  UserDetailsServiceImpl.class,
  JWTTokenProvider.class,
  JWTAuthenticationEntryPoint.class,
  JWTAccessDeniedHandler.class,
  TestSecurityConfiguration.class
})
public @interface ImportTestSecurityConfiguration {

}
