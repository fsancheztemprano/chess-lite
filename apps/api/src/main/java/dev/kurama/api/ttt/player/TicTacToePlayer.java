package dev.kurama.api.ttt.player;

import dev.kurama.api.core.domain.AbstractEntity;
import dev.kurama.api.core.domain.User;
import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
public class TicTacToePlayer extends AbstractEntity implements Serializable {

  @Builder.Default
  private int wins = 0;
  @Builder.Default
  private int losses = 0;
  @Builder.Default
  private int draws = 0;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @NonNull
  @OneToOne(fetch = FetchType.EAGER, optional = false)
  private User user;

  public enum Token {
    X, O, NONE
  }
}
