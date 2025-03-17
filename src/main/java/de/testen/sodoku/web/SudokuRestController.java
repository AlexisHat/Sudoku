package de.testen.sodoku.web;

import de.testen.sodoku.domain.SudokuGame;
//import org.springframework.data.relational.core.sql.In;
import de.testen.sodoku.service.SudokuService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class SudokuRestController {

    private final SudokuService sudokuService;

    public SudokuRestController(SudokuService sudokuService) {
        this.sudokuService = sudokuService;
    }

    @GetMapping("/sudoku")
    public int[][] getSudoku(@RequestParam(defaultValue = "2") int difficulty) {
        SudokuGame game = new SudokuGame(difficulty);
        return game.getGameBoard();
    }

    @PostMapping("/validate")
    public Map<String, Boolean> validateSudoku(@RequestBody int[][] board) {
        return Map.of("valid", sudokuService.validate(board));
    }
}