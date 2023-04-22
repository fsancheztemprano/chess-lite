package dev.kurama.api.ttt.move;

import dev.kurama.api.core.domain.AbstractEntity;
import dev.kurama.api.ttt.game.TicTacToeGame;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import java.io.Serializable;
import java.time.LocalDateTime;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
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
public class TicTacToeGameMove extends AbstractEntity implements Serializable {

  @NonNull
  private String cell;

  @NonNull
  private TicTacToePlayer.Token token;

  @NonNull
  private String board;

  @NonNull
  private Integer number;

  @NonNull
  private LocalDateTime movedAt;

  @NonNull
  private Long moveTime;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.REMOVE)
  private TicTacToeGame game;

  @ToString.Exclude
  @OneToOne(fetch = FetchType.LAZY)
  private TicTacToePlayer player;

}
