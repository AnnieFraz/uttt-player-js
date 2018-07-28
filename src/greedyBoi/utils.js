const _column = (board, n) => board.map(x => x[n]);
const _columns = (board) => board.map((_, index) => _column(board, index));
/* \ */
const _majorDiagonal = (board) => board.map((row, index) => row[index]);

/* / */
const _minorDiagonal = (board) => board.map((row, index) => row[row.length - 1 - index]);

function getWinningPositionSmallBoi(cells, playerNo) {
    let playerScore = 0;
    for (let i = 0; i < cells.length; ++i) {
        playerScore += (cells[i].player == playerNo);
    }

    // It is a winning position if the last cell is empty
    if (playerScore == cells.length - 1)
    {
        return cells.filter((cell) => !cell.isPlayed())[0]
    }
    return null
}

/**
 * finds positions that are ready to close (2 in  arow) for player
 * @param board
 * @param playerNo
 */
function getCloseablePositionsSmallBoi(board, playerNo) {
    return [].concat(
        // Iterate rows/cols
        board.map(row => getWinningPositionSmallBoi(row, playerNo)),
        _columns(board).map(column => getWinningPositionSmallBoi(column, playerNo)),
        // Iterate diagonals
        getWinningPositionSmallBoi(_majorDiagonal(board), playerNo),
        getWinningPositionSmallBoi(_minorDiagonal(board), playerNo)
    ).filter(Boolean);
}

function getWinningPositionBigBoi(boards, playerNo){
    let playerScore = 0;

    for (let i = 0; i < boards.length; ++i) {
        playerScore += (boards[i].winner == playerNo);
    }

    // It is a winning position if the last board is empty
    if (playerScore == boards.length - 1)
    {
        return boards.filter((board) => !board.isPlayed())[0]
    }
    return null
}

/**
 * finds positions that are ready to close (2 in  arow) for player
 * @param board
 * @param playerNo
 */
function getCloseablePositionsBigBoi(board, playerNo) {
    return [].concat(
        // Iterate rows/cols
        board.map(row => getWinningPositionBigBoi(row, playerNo)),
        _columns(board).map(column => getWinningPositionBigBoi(column, playerNo)),
        // Iterate diagonals
        getWinningPositionBigBoi(_majorDiagonal(board), playerNo),
        getWinningPositionBigBoi(_minorDiagonal(board), playerNo)
    ).filter(Boolean);
}

module.exports = getCloseablePositionsSmallBoi;
module.exports = getCloseablePositionsBigBoi;