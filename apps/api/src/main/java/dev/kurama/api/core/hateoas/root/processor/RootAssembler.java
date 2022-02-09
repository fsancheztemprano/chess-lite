package dev.kurama.api.core.hateoas.root.processor;

import lombok.NonNull;
import org.springframework.hateoas.RepresentationModel;

public interface RootAssembler<T extends RepresentationModel<T>> {

  @NonNull RepresentationModel<T> assemble();
}
