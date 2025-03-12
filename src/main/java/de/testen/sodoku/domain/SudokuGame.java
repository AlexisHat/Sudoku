package de.testen.sodoku.domain;

public class SudokuGame {
    private final int[][] board;
    private boolean gameOver;

    public SudokuGame(int[][] board) {
        this.board = board;
        gameOver = false;
    }

    public int[][] getBoard() {
        return board;
    }

    public boolean isGameOver() {
        return gameOver;
    }

    public void setGameOver(boolean gameOver) {
        this.gameOver = gameOver;
    }
}
