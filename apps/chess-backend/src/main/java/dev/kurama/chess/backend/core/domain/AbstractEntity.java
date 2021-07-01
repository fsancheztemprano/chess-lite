package dev.kurama.chess.backend.core.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter(AccessLevel.PROTECTED)
@SuperBuilder
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@MappedSuperclass
public abstract class AbstractEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(nullable = false, updatable = false)
  @JsonProperty(access = Access.READ_WRITE)
  private Long tid;

  @NonNull
  @NotBlank
  @Column(nullable = false, updatable = false, unique = true)
  private String id;

  public String setRandomUUID() {
    id = randomUUID();
    return id;
  }

  public static String randomUUID() {
    return UUID.randomUUID().toString();
  }
}
