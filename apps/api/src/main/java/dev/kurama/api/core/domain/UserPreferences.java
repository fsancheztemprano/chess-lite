package dev.kurama.api.core.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import java.io.Serializable;
import java.util.Locale;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
public class UserPreferences extends AbstractEntity implements Serializable {

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @OneToOne(mappedBy = "userPreferences", fetch = FetchType.LAZY)
  private User user;

  @Builder.Default
  private boolean darkMode = false;

  @Builder.Default
  private String contentLanguage = Locale.ENGLISH.getLanguage();
}
