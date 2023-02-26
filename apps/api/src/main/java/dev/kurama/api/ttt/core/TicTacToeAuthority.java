package dev.kurama.api.ttt.core;

import com.google.common.collect.Lists;
import java.util.List;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component("TicTacToeAuthority")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TicTacToeAuthority {

  public static final String TIC_TAC_TOE_ROOT = "tic-tac-toe:root";
  public static final String TIC_TAC_TOE_GAME_READ = "tic-tac-toe:game:read";
  public static final String TIC_TAC_TOE_GAME_CREATE = "tic-tac-toe:game:create";
  public static final String TIC_TAC_TOE_GAME_MOVE = "tic-tac-toe:game:move";


  public static final List<String> TIC_TAC_TOE_AUTHORITIES = Lists.newArrayList(TIC_TAC_TOE_ROOT, TIC_TAC_TOE_GAME_READ,
    TIC_TAC_TOE_GAME_CREATE, TIC_TAC_TOE_GAME_MOVE);

}
