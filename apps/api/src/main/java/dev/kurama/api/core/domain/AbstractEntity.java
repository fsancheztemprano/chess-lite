package dev.kurama.api.core.domain;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Setter(AccessLevel.PROTECTED)
@Getter
@ToString
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@MappedSuperclass
public abstract class AbstractEntity {

  @Id
  @NonNull
  @NotBlank
  @Column(nullable = false, updatable = false, unique = true)
  private String id;

  protected AbstractEntity(AbstractEntityBuilder<?, ?> b) {
    this.id = b.id;
  }

  public abstract static class AbstractEntityBuilder<C extends AbstractEntity, B extends AbstractEntityBuilder<C, B>> {

    public B setRandomUUID() {
      this.id = randomUUID();
      return self();
    }

    public B setIdOrRandomUUID(String id) {
      this.id = isEmpty(id) ? randomUUID() : id;
      return self();
    }
  }
}
