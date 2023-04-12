package dev.kurama.api.ttt.core;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import org.junit.jupiter.api.Test;

class TicTacToeUtilsTest {

  @Test
  void should_return_true_when_legal_move() {
    String board = "XOXO_OXOX";
    String cell = "B2";

    assertTrue(TicTacToeUtils.isLegalMove(board, cell));
  }

  @Test
  void should_return_false_when_ilegal_move() {
    String board = "XOXO_OXOX";
    String cell = "B1";

    assertFalse(TicTacToeUtils.isLegalMove(board, cell));
  }

  @Test
  void should_return_false_when_invalid_move() {
    String board = "XOXO_OXOX";

    assertFalse(TicTacToeUtils.isLegalMove(board, "A"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "A0"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "A4"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "B"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "B0"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "B4"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "C"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "C0"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "C4"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "D"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "D1"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "D2"));
    assertFalse(TicTacToeUtils.isLegalMove(board, "D3"));
  }

  @Test
  void should_get_cell_index_in_board() {
    assertEquals(0, TicTacToeUtils.getIndexInBoard("A1"));
    assertEquals(1, TicTacToeUtils.getIndexInBoard("A2"));
    assertEquals(2, TicTacToeUtils.getIndexInBoard("A3"));
    assertEquals(3, TicTacToeUtils.getIndexInBoard("B1"));
    assertEquals(4, TicTacToeUtils.getIndexInBoard("B2"));
    assertEquals(5, TicTacToeUtils.getIndexInBoard("B3"));
    assertEquals(6, TicTacToeUtils.getIndexInBoard("C1"));
    assertEquals(7, TicTacToeUtils.getIndexInBoard("C2"));
    assertEquals(8, TicTacToeUtils.getIndexInBoard("C3"));
  }

  @Test
  void should_get_negative_index_if_invalid_cell() {
    assertEquals(-1, TicTacToeUtils.getIndexInBoard("A"));
    assertEquals(-1, TicTacToeUtils.getIndexInBoard("A0"));
    assertEquals(-1, TicTacToeUtils.getIndexInBoard("A4"));
    assertEquals(-1, TicTacToeUtils.getIndexInBoard("D1"));
    assertEquals(-1, TicTacToeUtils.getIndexInBoard("D2"));
    assertEquals(-1, TicTacToeUtils.getIndexInBoard("D3"));
  }

  @Test
  void should_return_true_if_there_is_a_winner() {
    assertTrue(TicTacToeUtils.isGameWon("XO_XO_X__"));
    assertTrue(TicTacToeUtils.isGameWon("XO_OX___X"));
    assertTrue(TicTacToeUtils.isGameWon("XOXOXOXOX"));

  }

  @Test
  void should_return_false_if_there_is_no_winner() {
    assertFalse(TicTacToeUtils.isGameWon("_________"));
    assertFalse(TicTacToeUtils.isGameWon("XOXO_OXOX"));
    assertFalse(TicTacToeUtils.isGameWon("XXOOOXXXO"));
  }

  @Test
  void should_return_true_if_game_finished_with_no_winner() {
    assertTrue(TicTacToeUtils.isGameTied("XXOOOXXXO"));
  }

  @Test
  void should_return_false_if_game_finished_with_a_winner() {
    assertFalse(TicTacToeUtils.isGameTied("XO_XO_X__"));
  }

  @Test
  void should_return_false_if_game_not_finished() {
    assertFalse(TicTacToeUtils.isGameTied("XOXO_OXOX"));
  }

  @Test
  void should_return_true_if_game_is_won() {
    assertTrue(TicTacToeUtils.isGameOver("XO_XO_X__"));
  }

  @Test
  void should_return_true_if_game_is_tied() {
    assertTrue(TicTacToeUtils.isGameOver("XXOOOXXXO"));
  }

  @Test
  void should_return_false_if_game_is_not_finished() {
    assertFalse(TicTacToeUtils.isGameOver("XOXO_OXOX"));
  }

  @Test
  void should_get_a_list_of_last_valid_moves() {
    String board = "XOXO_OXOX";
    List<String> moves = TicTacToeUtils.getPossibleMoves(board);
    assertEquals(1, moves.size());
    assertEquals("B2", moves.get(0));
  }

  @Test
  void should_get_a_list_of_all_valid_moves() {
    String board = "_________";
    List<String> moves = TicTacToeUtils.getPossibleMoves(board);
    assertEquals(9, moves.size());
    assertEquals("A1", moves.get(0));
    assertEquals("A2", moves.get(1));
    assertEquals("A3", moves.get(2));
    assertEquals("B1", moves.get(3));
    assertEquals("B2", moves.get(4));
    assertEquals("B3", moves.get(5));
    assertEquals("C1", moves.get(6));
    assertEquals("C2", moves.get(7));
    assertEquals("C3", moves.get(8));
  }

  @Test
  void should_get_a_list_of_no_valid_moves() {
    String board = "XOXOXOXOX";
    List<String> moves = TicTacToeUtils.getPossibleMoves(board);
    assertEquals(0, moves.size());
  }
}
