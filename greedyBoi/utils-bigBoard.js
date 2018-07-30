const _column = (board, n) => board.map(x => x[n]);
const _columns = (board) => board.map((_, index) => _column(board, index));
/* \ */
const _majorDiagonal = (board) => board.map((row, index) => row[index]);

/* / */
const _minorDiagonal = (board) => board.map((row, index) => row[row.length - 1 - index]);

function getWinningPositionBigBoard(boards, playerNo){
    let playerScore = 0;

    for (let i = 0; i < boards.length; ++i) {
        playerScore += (boards[i].winner == playerNo);
    }

    // It is a winning position if the last board is empty
    if (playerScore == boards.length - 1)
    {
        return boards.filter((board) => !board.isFinished())[0]
    }
    return null
}

/**
 * finds positions that are ready to close (2 in  arow) for player
 * @param board
 * @param playerNo
 */
function getCloseablePositionsBigBoard(board, playerNo) {
    return [].concat(
        // Iterate rows/cols
        board.map(row => getWinningPositionBigBoard(row, playerNo)),
        _columns(board).map(column => getWinningPositionBigBoard(column, playerNo)),
        // Iterate diagonals
        getWinningPositionBigBoard(_majorDiagonal(board), playerNo),
        getWinningPositionBigBoard(_minorDiagonal(board), playerNo)
    ).filter(Boolean);
}

module.exports = getCloseablePositionsBigBoard;