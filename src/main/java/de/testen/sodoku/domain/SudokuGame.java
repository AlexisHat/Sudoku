package de.testen.sodoku.domain;
import java.util.*;

public class SudokuGame {
    private static final int SIZE = 9;
    private static final int SUBGRID_SIZE = 3;
    private static final Random RANDOM = new Random();

    private final int[][] gameBoard;

    public SudokuGame(int difficulty) {
        this.gameBoard = generateSudoku(difficulty);
    }

    public static int[][] generateSudoku(int difficulty) {
        int[][] board = new int[SIZE][SIZE];

        // 1. Generiere eine vollständige Lösung mit Backtracking
        fillBoard(board);

        // 2. Entferne gezielt Zahlen, um ein lösbares Sudoku zu erzeugen
        removeNumbers(board, difficulty);

        return board;
    }

    /** Füllt das Sudoku-Board mit einer vollständigen, gültigen Lösung */
    private static boolean fillBoard(int[][] board) {
        return solve(board, 0, 0);
    }

    /** Backtracking-Algorithmus zum Lösen eines Sudokus */
    private static boolean solve(int[][] board, int row, int col) {
        if (row == SIZE) return true;  // Board ist fertig gefüllt

        int nextRow = (col == SIZE - 1) ? row + 1 : row;
        int nextCol = (col + 1) % SIZE;

        if (board[row][col] != 0) return solve(board, nextRow, nextCol);

        List<Integer> numbers = getRandomNumbers1To9();
        for (int num : numbers) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solve(board, nextRow, nextCol)) return true;
                board[row][col] = 0; // Rückgängigmachen (Backtracking)
            }
        }
        return false; // Keine gültige Zahl gefunden
    }

    /** Gibt eine zufällige Reihenfolge von 1 bis 9 zurück */
    private static List<Integer> getRandomNumbers1To9() {
        List<Integer> numbers = new ArrayList<>();
        for (int i = 1; i <= SIZE; i++) {
            numbers.add(i);
        }
        Collections.shuffle(numbers);
        return numbers;
    }

    /** Entfernt Zahlen, um ein lösbares Sudoku mit eindeutiger Lösung zu erhalten */
    public static void removeNumbers(int[][] board, int difficulty) {
        int cellsToRemove = getCellsToRemove(difficulty);

        List<int[]> positions = new ArrayList<>();
        for (int row = 0; row < SIZE; row++) {
            for (int col = 0; col < SIZE; col++) {
                positions.add(new int[]{row, col});
            }
        }
        Collections.shuffle(positions); // Zufällige Reihenfolge

        for (int[] pos : positions) {
            if (cellsToRemove == 0) break;

            int row = pos[0], col = pos[1];
            int temp = board[row][col];
            board[row][col] = 0;

            if (!hasUniqueSolution(deepCopy(board))) {
                board[row][col] = temp; // Rückgängig machen, falls mehrdeutig
            } else {
                cellsToRemove--;
            }
        }
    }

    /** Prüft, ob das Sudoku eine eindeutige Lösung hat */
    private static boolean hasUniqueSolution(int[][] board) {
        return countSolutions(board, 0) == 1;
    }

    /** Zählt die Anzahl der Lösungen und bricht früh ab, wenn mehr als eine existiert */
    private static int countSolutions(int[][] board, int count) {
        for (int row = 0; row < SIZE; row++) {
            for (int col = 0; col < SIZE; col++) {
                if (board[row][col] == 0) {
                    for (int num = 1; num <= SIZE; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            count = countSolutions(board, count);
                            if (count > 1) return count; // Mehr als eine Lösung -> Abbruch
                            board[row][col] = 0;
                        }
                    }
                    return count;
                }
            }
        }
        return count + 1;
    }

    /** Prüft, ob eine Zahl in einer bestimmten Position gesetzt werden kann */
    private static boolean isValid(int[][] board, int row, int col, int num) {
        for (int i = 0; i < SIZE; i++) {
            if (board[row][i] == num || board[i][col] == num) return false;
        }
        int boxRow = (row / SUBGRID_SIZE) * SUBGRID_SIZE, boxCol = (col / SUBGRID_SIZE) * SUBGRID_SIZE;
        for (int i = 0; i < SUBGRID_SIZE; i++) {
            for (int j = 0; j < SUBGRID_SIZE; j++) {
                if (board[boxRow + i][boxCol + j] == num) return false;
            }
        }
        return true;
    }

    /** Kopiert das Sudoku-Board tief */
    private static int[][] deepCopy(int[][] original) {
        int[][] copy = new int[SIZE][SIZE];
        for (int i = 0; i < SIZE; i++) {
            System.arraycopy(original[i], 0, copy[i], 0, SIZE);
        }
        return copy;
    }

    /** Gibt die Anzahl der zu entfernenden Zellen für einen Schwierigkeitsgrad zurück */
    private static int getCellsToRemove(int difficulty) {
        return switch (difficulty) {
            case 1 -> 40; // Leicht
            case 2 -> 46; // Mittel
            case 3 -> 52; // Schwer
            default -> 40; // Standard
        };
    }

    /** Gibt das Sudoku-Board als lesbare Zeichenkette zurück */
    public void printBoard() {
        for (int row = 0; row < SIZE; row++) {
            if (row % 3 == 0) System.out.println("+-------+-------+-------+");
            for (int col = 0; col < SIZE; col++) {
                if (col % 3 == 0) System.out.print("| ");
                System.out.print(gameBoard[row][col] == 0 ? ". " : gameBoard[row][col] + " ");
            }
            System.out.println("|");
        }
        System.out.println("+-------+-------+-------+");
    }

    public int[][] getGameBoard() {
        return gameBoard;
    }
}

