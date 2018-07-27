const getCloseablePositionsBigBoi = require("./utils");
const getCloseablePositionsSmallBoi = require("./utils");

class GreedyBoi{
    
    constructor(game){
        this.game = game;
    }

    evalSubBoard(state, subBoard){


        let scoreMatrix = [[25,10,25],
                           [10,50,10],
                           [25,10,25]]

        let myWinningBigBois = getCloseablePositionsBigBoi(state.board.board, state.player);

        let enemyWinningBigBois = getCloseablePositionsBigBoi(state.board.board, 1-state.player);
        
        if(myWinningBigBois.length > 0){
            for(boi of myWinningBigBois){
                scoreMatrix[boi[0]][boi[1]] -= 100;
            }
        }

        if(enemyWinningBigBois.length > 0){
            for(boi of enemyWinningBigBois){
                scoreMatrix[boi[0]][boi[1]] -= 1000;
            }
         }

        for(let smallBoiPos of getCloseablePositionsSmallBoi(subBoard.board,state.player)){
            scoreMatrix[boi[0]][boi[1]] += 1000;
        }

        for(let smallBoiPos of getCloseablePositionsSmallBoi(subBoard.board,1-state.player)){
            scoreMatrix[boi[0]][boi[1]] -= 1000;
        }

        return scoreMatrix;  
    }
  
    bestMove(state){

        let bestBoi;
        let maxScore;
        let bestScoreMatrix;

        let validBoards = state.board.getValidBoards();
        if(validBoards <= 1){
            bestBoi = validBoards;
            bestScoreMatrix = this.evalSubBoard(state, state.board.board[validBoards[0]][validBoards[1]]);

        }else{
            for(let subBoardCoords of validBoards){
                let subBoard = subBoardCoords[0][1];
    
                let scoreMatrix = this.evalSubBoard(state, subBoard);
    
                if(Math.max(scoreMatrix) > maxScore){
                    let maxScore = Math.max(scoreMatrix);
                    let bestBoi = subBoardCoords;
                    let bestScoreMatrix = scoreMatrix;
                }
            }
        }

        let bestScore;
        let bestMove;

        for(let i = 0; i < scoreMatrix.length; i++){
            for(let j = 0; j < scoreMatrix[i].length; j++){
                if(scoreMatrix[i][j] > bestScore){
                    bestScore = scoreMatrix[i][j];
                    bestMove = [i,j];
                }
            }
        }

        return new Move(bestBoi[0], bestBoi[1], bestMove[0], bestMove[1]);


        //One of yus implement this shet
        for(move of moves){
            findBestMove();
        }
        //It's disgustang
        return move;
    }

    legalMoves(){


        return moves;
    }

    evalMove(move){

        //Check sequence
        //Check importance
        //Check next board
        //Apply weighting to cells
        //Decide



    }
}

module.exports = GreedyBoi;