/**
 * Calculate the winner of a tic-tac-toe game
 * @param squares The current state of the board
 * @returns The winner and winning line, or null if no winner
 */
export function calculateWinner(squares: Array<string | null>) {
  // All possible winning lines (rows, columns, diagonals)
  const lines = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal top-left to bottom-right
    [2, 4, 6], // diagonal top-right to bottom-left
  ];

  // Check each winning line
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c]
      };
    }
  }

  return null;
}

/**
 * Check if the game is a draw
 * @param squares The current state of the board
 * @returns True if the game is a draw, false otherwise
 */
export function checkDraw(squares: Array<string | null>): boolean {
  // If there's a winner, it's not a draw
  if (calculateWinner(squares)) {
    return false;
  }
  
  // If all squares are filled, it's a draw
  return squares.every(square => square !== null);
}

/**
 * AI player logic - evaluates the board and returns the best move
 * Uses minimax algorithm with strategic scoring
 * @param squares The current state of the board
 * @returns The best square index for AI to play
 */
export function getAIMove(squares: Array<string | null>): number {
  // Get all available moves
  const availableMoves = squares
    .map((square, index) => square === null ? index : null)
    .filter(index => index !== null) as number[];

  if (availableMoves.length === 0) {
    return -1; // No moves available
  }

  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  // Evaluate each available move using minimax
  for (const move of availableMoves) {
    const newBoard = [...squares];
    newBoard[move] = 'O';
    const score = minimax(newBoard, 0, false);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Minimax algorithm for evaluating board positions
 * @param squares The current board state
 * @param depth The current depth in the search tree
 * @param isMaximizing Whether we're maximizing (AI) or minimizing (Player)
 * @returns The score of the position
 */
function minimax(squares: Array<string | null>, depth: number, isMaximizing: boolean): number {
  const result = calculateWinner(squares);
  
  // Terminal states
  if (result) {
    return result.winner === 'O' ? 10 - depth : -10 + depth;
  }
  
  if (checkDraw(squares)) {
    return 0;
  }

  if (isMaximizing) {
    // AI's turn (O) - maximize score
    let bestScore = -Infinity;
    
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        const score = minimax(squares, depth + 1, false);
        squares[i] = null;
        bestScore = Math.max(bestScore, score);
      }
    }
    
    return bestScore;
  } else {
    // Player's turn (X) - minimize score
    let bestScore = Infinity;
    
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = 'X';
        const score = minimax(squares, depth + 1, true);
        squares[i] = null;
        bestScore = Math.min(bestScore, score);
      }
    }
    
    return bestScore;
  }
}