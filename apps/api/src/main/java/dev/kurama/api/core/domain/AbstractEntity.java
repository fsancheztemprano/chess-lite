package dev.kurama.api.core.domain;

import java.util.UUID;
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

//  @Id
//  @GeneratedValue(strategy = GenerationType.IDENTITY)
//  @Column(nullable = false, updatable = false)
//  @JsonProperty(access = Access.READ_WRITE)
//  private Long tid;

  @Id
  @NonNull
  @NotBlank
  @Column(nullable = false, updatable = false, unique = true)
  private String id;

  protected AbstractEntity(AbstractEntityBuilder<?, ?> b) {
//    this.tid = b.tid;
    this.id = b.id;
  }

  public void setRandomUUID() {
    id = randomUUID();
  }

  public static String randomUUID() {
    return UUID.randomUUID().toString();
  }

  public abstract static class AbstractEntityBuilder<C extends AbstractEntity, B extends AbstractEntityBuilder<C, B>> {

    public B setRandomUUID() {
      this.id = randomUUID();
      return self();
    }
  }
}
