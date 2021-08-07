package dev.kurama.chess.backend.hateoas;

import static org.springframework.hateoas.config.EnableHypermediaSupport.HypermediaType.HAL;
import static org.springframework.hateoas.config.EnableHypermediaSupport.HypermediaType.HAL_FORMS;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.config.EnableHypermediaSupport;
import org.springframework.web.filter.ForwardedHeaderFilter;
import org.springframework.web.server.adapter.ForwardedHeaderTransformer;

@Configuration
@EnableHypermediaSupport(type = {HAL, HAL_FORMS})
public class HateoasConfiguration {

  @Bean
  @Primary
  public PagedResourcesAssembler<?> configure(PagedResourcesAssembler<?> pagedResourcesAssembler) {
    pagedResourcesAssembler.setForceFirstAndLastRels(false);
    return pagedResourcesAssembler;
  }

  @Bean
  public ForwardedHeaderFilter forwardHeaderFilter() {
    return new ForwardedHeaderFilter();
  }

  @Bean
  public ForwardedHeaderTransformer forwardHeaderTransformer() {
    return new ForwardedHeaderTransformer();
  }
}
