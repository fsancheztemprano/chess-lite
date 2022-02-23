package dev.kurama.api.support;

import dev.kurama.api.core.mapper.AuthorityMapperImpl;
import dev.kurama.api.core.mapper.GlobalSettingsMapperImpl;
import dev.kurama.api.core.mapper.RoleMapperImpl;
import dev.kurama.api.core.mapper.UserMapperImpl;
import dev.kurama.api.core.mapper.UserPreferencesMapperImpl;
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
@Import({AuthorityMapperImpl.class, GlobalSettingsMapperImpl.class, RoleMapperImpl.class,
  UserPreferencesMapperImpl.class, UserMapperImpl.class})
public @interface ImportMappers {

}
