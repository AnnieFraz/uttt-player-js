const getCloseablePositions = require("./utils");
const getCloseablePositionsBigBoard = require("./utils-bigBoard");
const Node = require("./node");
const Move = require("./move");

const centerBoard = [1,1];
const cornerBoards = [[0,0],[0,2],[2,0],[2,2]];

class GreedyBoi{
    
    constructor(game){
        this.game = game;
        this.nodes = new Map();
    }

    makeNode(state){
        if(!this.nodes.has(state.hash())){
            let unexpandedMoves = state.legalMoves().slice();
            let node = new Node(null, null, state, unexpandedMoves);
            this.nodes.set(state.hash(), node)
        }
    }

    minMax(state, depthLimit){

        let depth = 0;
        this.makeNode(state);

        while(depth < depthLimit){



        }

        return move;
    }
  
    bestMove(state, depthLimit){

        let legalMoves = state.legalMoves();
        let index = Math.floor(Math.random() * legalMoves.length);
        let bestMove = legalMoves[index];


        for(let i = 0; i < legalMoves.length; i++){
            let timeStart = Date.now();
            legalMoves[i] = this.evalMove(state, legalMoves[i]);
            let timeFinish = Date.now();
            console.log("Time taken: " + (timeFinish - timeStart));
        }

        for(let move of legalMoves){
            if(move.score > bestMove.score){
                bestMove = move;
            }
        }

        return bestMove;
    }

    evalMove(state, move){

        let nextState = state.nextState(move);

        if(nextState.game.winner === state.player){
            move.score = Infinity;
            return move;
        }

        if(nextState.game.board[move.row][move.col].isFinished()){
            if(move.getBoardCoords() === centerBoard){
                move.score += 10;
            }else if (cornerBoards.includes(move.getBoardCoords())){
                move.score +=3;
            }else{
                move.score +=5;
            }
        }

        let myOldWinningPositions = getCloseablePositions(state.game.board[move.subRow][move.subCol].board, state.player);
        let myNewWinningPositions = getCloseablePositions(nextState.game.board[move.subRow][move.subCol].board, state.player);

        if(myNewWinningPositions.length > myOldWinningPositions.length){
            move.score += 2;
        }

        let opponentOldWinningPositions = getCloseablePositions(nextState.game.board[move.subRow][move.subCol].board, state.player);
        let opponentNewWinningPositions = getCloseablePositions(state.game.board[move.subRow][move.subCol].board, state.player);

        if(opponentNewWinningPositions.length < opponentOldWinningPositions.length){
            move.score += 1;
        }

        let myOldWinningPositionsBigBoard = getCloseablePositionsBigBoard(state.game.board[move.subRow][move.subCol].board, state.player);
        let myNewWinningPositionsBigBoard = getCloseablePositionsBigBoard(nextState.game.board[move.subRow][move.subCol].board, state.player);

        if(myNewWinningPositionsBigBoard.length > myOldWinningPositionsBigBoard.length){
            move.score += 4;
        }

        let opponentOldWinningPositionsBigBoard = getCloseablePositionsBigBoard(nextState.game.board[move.subRow][move.subCol].board, state.player);
        let opponentNewWinningPositionsBigBoard = getCloseablePositionsBigBoard(state.game.board[move.subRow][move.subCol].board, state.player);

        if(opponentNewWinningPositionsBigBoard.length < opponentOldWinningPositionsBigBoard.length){
            move.score += 2;
        }

        return move;

    }

}

module.exports = GreedyBoi;