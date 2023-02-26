package dev.kurama.api.ttt.game;

import com.google.common.collect.Sets;
import dev.kurama.api.core.domain.AbstractEntity;
import dev.kurama.api.ttt.move.TicTacToeGameMove;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
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
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
public class TicTacToeGame extends AbstractEntity implements Serializable {

  @NonNull
  private Status status;

  private boolean isPrivate;

  private TicTacToePlayer.Token result;

  private TicTacToePlayer.Token turn;

  private String board;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @OneToOne(fetch = FetchType.LAZY)
  private TicTacToePlayer playerX;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @OneToOne(fetch = FetchType.LAZY)
  private TicTacToePlayer playerO;

  private LocalDateTime requestedAt;

  private LocalDateTime startedAt;

  private LocalDateTime lastActivityAt;

  private LocalDateTime finishedAt;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  @OneToMany(mappedBy = "game", fetch = FetchType.LAZY)
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
