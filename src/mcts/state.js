"use strict";

const Move = require('./move');

class State{

    constructor(moveHistory, board, player){
        this.moveHistory = moveHistory;
        this.board = board;
        this.player = player;
    }

    isPlayer(player){
        return(player === this.player);
    }

    hash(){
        return JSON.stringify(this.moveHistory);
    }

    /** Utility functions to fill gaps in engine api **/
        nextState(move){

            if(this.board.isFinished())
                return this;

            let newHistory = this.moveHistory.slice();
            newHistory.push(move);
            let newBoard;
            if(this.player === 1){
                newBoard = this.board.addMyMove(move.getBoardCoords(),move.getCoords());
            }else if(this.player === 0){
                newBoard = this.board.addOpponentMove(move.getBoardCoords(),move.getCoords());
            }

            let newPlayer;
            if(this.player === 0){
                newPlayer = 1;
            }else{
                newPlayer = 0;
            }

            return new State(newHistory, newBoard, newPlayer);
        }

        legalMoves(){
            let validBoards = this.board.getValidBoards();
            let moves = [];
            for(let subCoords of validBoards){
                let subBoard = this.board.board[subCoords[0]][subCoords[1]];
                let validMoves = subBoard.getValidMoves();
                for(let valMove of validMoves){
                    let move = new Move(subCoords[0], subCoords[1], valMove[0], valMove[1]);
                    moves.push(move)
                }
            }
        return moves;
    }

}

module.exports = State;
