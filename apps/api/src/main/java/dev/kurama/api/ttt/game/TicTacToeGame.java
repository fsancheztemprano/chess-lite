package dev.kurama.api.ttt.game;

import com.google.common.collect.Sets;
import dev.kurama.api.core.domain.AbstractEntity;
import dev.kurama.api.ttt.move.TicTacToeGameMove;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@ToString
@NoArgsConstructor(force = true)
@RequiredArgsConstructor
@Entity
public class TicTacToeGame extends AbstractEntity implements Serializable {

  @NonNull
  private Status status;

  private boolean isPrivate;

  private TicTacToePlayer.Token turn;

  private String board;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private TicTacToePlayer playerX;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private TicTacToePlayer playerO;

  private LocalDateTime lastActivityAt;

  private LocalDateTime requestedAt;

  private LocalDateTime startedAt;

  private LocalDateTime finishedAt;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  @OneToMany(mappedBy = "game", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
  private Set<TicTacToeGameMove> moves = Sets.newHashSet();


  public enum Status {
    PENDING, IN_PROGRESS, REJECTED, FINISHED
  }


  public TicTacToePlayer getCurrentPlayer() {
    if (turn == TicTacToePlayer.Token.X) {
      return playerX;
    } else if (turn == TicTacToePlayer.Token.O) {
      return playerO;
    } else {
      return null;
    }
  }
}
