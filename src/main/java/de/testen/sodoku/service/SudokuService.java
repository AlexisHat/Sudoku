package de.testen.sodoku.service;

import de.testen.sodoku.domain.SudokuGame;
import org.springframework.stereotype.Service;

@Service
public class SudokuService {

    public boolean validate(int[][] board) {
        return checkRows(board) && checkColumns(board) && checkSubgrids(board);
    }

    private boolean checkRows(int[][] board) {
        for (int row = 0; row < 9; row++) {
            if (!isValidSet(board[row])) {
                return false;
            }
        }
        return true;
    }

    private boolean checkColumns(int[][] board) {
        for (int col = 0; col < 9; col++) {
            int[] column = new int[9];
            for (int row = 0; row < 9; row++) {
                column[row] = board[row][col];
            }
            if (!isValidSet(column)) {
                return false;
            }
        }
        return true;
    }

    private boolean checkSubgrids(int[][] board) {
        for (int row = 0; row < 9; row += 3) {
            for (int col = 0; col < 9; col += 3) {
                if (!isValidSubgrid(board, row, col)) {
                    return false;
                }
            }
        }
        return true;
    }

    private boolean isValidSubgrid(int[][] board, int startRow, int startCol) {
        boolean[] seen = new boolean[9];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                int num = board[startRow + i][startCol + j];
                if (num != 0) {
                    if (seen[num - 1]) return false; // Zahl schon gesehen → Fehler
                    seen[num - 1] = true;
                }
            }
        }
        return true;
    }

    private boolean isValidSet(int[] nums) {
        boolean[] seen = new boolean[9];
        for (int num : nums) {
            if (num != 0) {
                if (seen[num - 1]) return false; // Zahl schon gesehen → Fehler
                seen[num - 1] = true;
            }
        }
        return true;
    }


}
