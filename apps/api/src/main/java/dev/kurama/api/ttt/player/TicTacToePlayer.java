package dev.kurama.api.ttt.player;

import com.google.common.collect.Sets;
import dev.kurama.api.core.domain.AbstractEntity;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.ttt.game.TicTacToeGame;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.io.Serializable;
import java.util.Set;
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
@NoArgsConstructor(force = true)
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
  @OneToMany(mappedBy = "playerO", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
  private Set<TicTacToeGame> gamesAsO = Sets.newHashSet();

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  @OneToMany(mappedBy = "playerX", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
  private Set<TicTacToeGame> gamesAsX = Sets.newHashSet();

  @NonNull
  private String username;

  public enum Token {
    X, O, NONE
  }
}
