package dev.kurama.api.ttt.core;

import static org.apache.commons.lang3.StringUtils.isEmpty;

import java.util.Optional;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TicTacToeUtils {

  public static boolean isLegalMove(String board, String cell) {
    if (isEmpty(board) || isEmpty(cell)) {
      return false;
    }
    return getCharAtCell(board, cell).orElse('#') == '_';
  }

  public static Optional<Character> getCharAtCell(String board, String cell) {
    if (isEmpty(board) || isEmpty(cell)) {
      return Optional.empty();
    }
    try {
      return Optional.of(board.charAt(getIndexInBoard(cell)));
    } catch (IndexOutOfBoundsException e) {
      return Optional.empty();
    }
  }

  public static int getIndexInBoard(String cell) {
    try {
      int x = cell.charAt(0) - 'A';
      int y = cell.charAt(1) - '1';
      return y * 3 + x;
    } catch (IndexOutOfBoundsException e) {
      return -1;
    }
  }

  public static boolean isGameWon(String board) {
    // Check horizontal rows
    for (int i = 0; i < 9; i += 3) {
      if (board.charAt(i) != '_' && board.charAt(i) == board.charAt(i + 1) && board.charAt(i) == board.charAt(i + 2)) {
        return true;
      }
    }
    // Check vertical columns
    for (int i = 0; i < 3; i++) {
      if (board.charAt(i) != '_' && board.charAt(i) == board.charAt(i + 3) && board.charAt(i) == board.charAt(i + 6)) {
        return true;
      }
    }
    // Check diagonal lines
    if (board.charAt(0) != '_' && board.charAt(0) == board.charAt(4) && board.charAt(0) == board.charAt(8)) {
      return true;
    }
    return board.charAt(2) != '_' && board.charAt(2) == board.charAt(4) && board.charAt(2) == board.charAt(6);
  }

  public static boolean isGameTied(String board) {
    return !isGameWon(board) && !board.contains("_");
  }

  public static boolean isGameOver(String board) {
    return isGameWon(board) || isGameTied(board);
  }
}
