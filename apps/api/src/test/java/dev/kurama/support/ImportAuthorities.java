package dev.kurama.support;

import dev.kurama.api.core.authority.AdminAuthority;
import dev.kurama.api.core.authority.AuthorityAuthority;
import dev.kurama.api.core.authority.GlobalSettingsAuthority;
import dev.kurama.api.core.authority.ProfileAuthority;
import dev.kurama.api.core.authority.RoleAuthority;
import dev.kurama.api.core.authority.ServiceLogsAuthority;
import dev.kurama.api.core.authority.ThemeAuthority;
import dev.kurama.api.core.authority.TokenAuthority;
import dev.kurama.api.core.authority.UserAuthority;
import dev.kurama.api.core.authority.UserPreferencesAuthority;
import dev.kurama.api.ttt.core.TicTacToeAuthority;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.context.annotation.Import;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Import({TokenAuthority.class, AdminAuthority.class, AuthorityAuthority.class, GlobalSettingsAuthority.class,
  UserAuthority.class, RoleAuthority.class, ProfileAuthority.class, ServiceLogsAuthority.class,
  UserPreferencesAuthority.class, ThemeAuthority.class, TicTacToeAuthority.class})
public @interface ImportAuthorities {

}
