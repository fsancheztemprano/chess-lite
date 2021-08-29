package dev.kurama.api.core.domain;

import java.io.Serializable;
import java.util.Locale;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import lombok.Builder;
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

  @OneToOne(cascade = CascadeType.ALL)
  private User user;

  @Builder.Default
  private boolean darkMode = false;

  @Builder.Default
  private String contentLanguage = Locale.ENGLISH.getLanguage();
}
