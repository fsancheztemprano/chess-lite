package dev.kurama.chess.backend.core.api.assembler;

import com.google.common.collect.Lists;
import java.util.Collection;
import lombok.NonNull;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

public interface DomainModelAssembler<T extends RepresentationModel<T>> extends
  RepresentationModelAssembler<T, T> {

  @Override
  @NonNull
  default CollectionModel<T> toCollectionModel(@NonNull Iterable<? extends T> entities) {
    return RepresentationModelAssembler.super.toCollectionModel(entities).add(getCollectionModelSelfLink());
  }

  @NonNull Link getCollectionModelSelfLink();

  @NonNull Link getModelSelfLink(@NonNull Long id);

  default Authentication getPrincipal() {
    return SecurityContextHolder.getContext().getAuthentication();
  }

  default Collection<? extends GrantedAuthority> getAuthorities() {
    return SecurityContextHolder.getContext().getAuthentication() == null ? Lists.newArrayList()
      : SecurityContextHolder.getContext().getAuthentication().getAuthorities();
  }

  default boolean hasAuthority(String authority) {
    return getAuthorities().contains(new SimpleGrantedAuthority(authority));
  }
}
