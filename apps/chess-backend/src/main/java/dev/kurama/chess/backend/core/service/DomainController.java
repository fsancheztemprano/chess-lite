package dev.kurama.chess.backend.core.service;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

public interface DomainController<T extends RepresentationModel<T>> {

  @GetMapping()
  ResponseEntity<CollectionModel<T>> getAll();

  @GetMapping("/{id}")
  ResponseEntity<T> get(@PathVariable("id") String id);
}
