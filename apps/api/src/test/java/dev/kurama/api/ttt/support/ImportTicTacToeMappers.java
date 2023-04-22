package dev.kurama.api.ttt.support;

import dev.kurama.api.ttt.game.TicTacToeGameMapperImpl;
import dev.kurama.api.ttt.move.TicTacToeGameMoveMapperImpl;
import dev.kurama.api.ttt.player.TicTacToePlayerMapperImpl;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.context.annotation.Import;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Import({TicTacToeGameMapperImpl.class, TicTacToeGameMoveMapperImpl.class, TicTacToePlayerMapperImpl.class})
public @interface ImportTicTacToeMappers {

}
