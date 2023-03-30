package dev.kurama.api.ttt.player;

import com.google.common.collect.Sets;
import dev.kurama.api.core.domain.AbstractEntity;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.ttt.game.TicTacToeGame;
import java.io.Serializable;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
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
  @OneToOne(fetch = FetchType.LAZY, optional = true)
  private User user;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  @OneToMany(mappedBy = "playerX", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
  private Set<TicTacToeGame> gamesO = Sets.newHashSet();

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  @OneToMany(mappedBy = "playerX", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
  private Set<TicTacToeGame> gamesX = Sets.newHashSet();

  @NonNull
  private String username;

  public enum Token {
    X, O, NONE
  }
}
