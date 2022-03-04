package dev.kurama.support;

import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ActiveProfiles;

/**
 * <p>Declares several {@link Configuration}s to be imported to get our {@link WebMvcTest}s working.</p>
 *
 * @since 1.0.0
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@ActiveProfiles(value = "integration-test")
@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = NONE)
@MockEventLayer
public @interface ServiceLayerIntegrationTestConfig {

}
