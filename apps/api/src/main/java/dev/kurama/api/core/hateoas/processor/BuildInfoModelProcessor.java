package dev.kurama.api.core.hateoas.processor;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.BuildInfoModel;
import dev.kurama.api.core.rest.BuildInfoController;
import lombok.NonNull;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class BuildInfoModelProcessor implements RepresentationModelProcessor<BuildInfoModel> {

  @Override
  public @NonNull BuildInfoModel process(@NonNull BuildInfoModel entity) {
    return entity.add(getSelfLink());
  }

  protected Link getSelfLink() {
    return linkTo(methodOn(BuildInfoController.class).get()).withSelfRel();
  }

}
