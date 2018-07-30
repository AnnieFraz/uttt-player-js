"use strict";

const MCTSNode = require('./mcts-node');
const Move = require('./move');
const State = require('./state');
const getCloseablePositions = require("./utils");
const getCloseablePositionsBigBoard = require("./utils-bigBoard");

class MCTS{

    constructor(game, UCB1ExploreParam = 2){
        this.game = game;
        this.UCB1ExploreParam = UCB1ExploreParam;
        this.nodes = new Map() // map: State.hash() => mcts-node
    }

    makeNode(state){
        if(!this.nodes.has(state.hash())){
            let unexpandedMoves = state.legalMoves().slice();
            let node = new MCTSNode(null, null, state, unexpandedMoves);
            this.nodes.set(state.hash(), node)
        }
    }

    runSearch(state, timeout = 3){
        
        this.makeNode(state);

        let draws = 0;
        let totalSims = 0;

        let end = Date.now() + timeout;

        while(Date.now() < end) {

            let node = this.select(state);
            let winner = state.board.winner;
            
            if (node.isLeaf() === false && winner === undefined) {
                node = this.expand(node);
                winner = this.simulate(node);
            }

            this.backpropogate(node, winner);

            if (winner === -1)
                draws++;

            totalSims++;
        }


        return{runtime: timeout, simulations: totalSims, draws: draws};
    }

    bestMove(state){
        
        this.makeNode(state);

        if(state.board.getMoves() === 0){
            return new Move(1,1,1,1);
        }

        let myWinningPosition = state.myWinningMoves();
        if(myWinningPosition != null){
            return myWinningPosition;
        }

        let opponentWinningPosition = state.opponentWinningMoves();
        if(opponentWinningPosition != null){
            return opponentWinningPosition;
        }

        if(this.nodes.get(state.hash()).isFullyExpanded() === false){
            let legalMoves = state.legalMoves();
            let index = Math.floor(Math.random() * legalMoves.length);
            let bestMove = legalMoves[index];
    
    
            for(let i = 0; i < legalMoves.length; i++){
                legalMoves[i] = this.evalMove(state, legalMoves[i]);
            }
    
            for(let move of legalMoves){
                if(move.score > bestMove.score){
                    bestMove = move;
                }
            }
    
            return bestMove;
        }
            

        if(this.nodes.get(state.hash()).isFullyExpanded() === false)
            throw new Error("Not enough information!");

        let node = this.nodes.get(state.hash());
        let allMoves = node.allMoves();
        let bestMove;

        let max = -Infinity;
        for(let move of allMoves) {
            let childNode = node.childNote(move);
            let ratio = childNode.n_wins / childNode.n_moves;
            if(ratio > max){
                bestMove = move;
                max = ratio;
            }
        }


        return bestMove;
    }

    //Phase 1
    select(state){
        
        let node = this.nodes.get(state.hash());

        while(node.isFullyExpanded() && !node.isLeaf()){
            let moves = node.allMoves();
            let bestMove;
            let bestUCB1 = -Infinity;

            for(let move of moves){
                let childUCB1 = node.childNote(move).getUCB1(this.UCB1ExploreParam);
                if(childUCB1 > bestUCB1){
                    bestMove = move;
                    bestUCB1 = childUCB1;
                }
            }

            node = node.childNote(bestMove);
        }

        return node;
    }

    //Phase 2
    expand(node){

        let moves = node.unexpandedMoves();
        let index = Math.floor(Math.random() * moves.length);
        let move = moves[index];

        let childState = node.state.nextState(move);
        let childUnexpandedMoves = childState.legalMoves();

        let childNode = node.expand(move, childState, childUnexpandedMoves);

        this.nodes.set(childState.hash(), childNode);

        return childNode;
    }


    //Phase 3
    simulate(node){
        
        let state = node.state;
        let winner = state.board.winner;

        while(winner === undefined){
            let moves = state.legalMoves();
            let move = moves[Math.floor(Math.random() * moves.length)];
            state = state.nextState(move);
            winner = state.board.winner;
        }

        return winner;
    }


    //Phase 4
    backpropogate(node, winner){

        while(node != null){
            node.n_moves += 1;

            if(node.state.isPlayer(-winner)){
                node.n_wins += 1;
            }

            node = node.parent;
        }
    }

    evalMove(state, move){

        let nextState = state.nextState(move);

        if(nextState.board.winner === state.player){
            move.score = Infinity;
            return move;
        }

        if(nextState.board.board[move.row][move.col].isFinished()){
            if(move.getBoardCoords() === centerBoard){
                move.score += 10;
            }else if (cornerBoards.includes(move.getBoardCoords())){
                move.score +=3;
            }else{
                move.score +=5;
            }
        }

        let myOldWinningPositions = getCloseablePositions(state.board.board[move.subRow][move.subCol].board, state.player);
        let myNewWinningPositions = getCloseablePositions(nextState.board.board[move.subRow][move.subCol].board, state.player);

        if(myNewWinningPositions.length > myOldWinningPositions.length){
            move.score += 2;
        }

        let opponentOldWinningPositions = getCloseablePositions(nextState.board.board[move.subRow][move.subCol].board, state.player);
        let opponentNewWinningPositions = getCloseablePositions(state.board.board[move.subRow][move.subCol].board, state.player);

        if(opponentNewWinningPositions.length < opponentOldWinningPositions.length){
            move.score += 1;
        }

        let myOldWinningPositionsBigBoard = getCloseablePositionsBigBoard(state.board.board[move.subRow][move.subCol].board, state.player);
        let myNewWinningPositionsBigBoard = getCloseablePositionsBigBoard(nextState.board.board[move.subRow][move.subCol].board, state.player);

        if(myNewWinningPositionsBigBoard.length > myOldWinningPositionsBigBoard.length){
            move.score += 4;
        }

        let opponentOldWinningPositionsBigBoard = getCloseablePositionsBigBoard(nextState.board.board[move.subRow][move.subCol].board, state.player);
        let opponentNewWinningPositionsBigBoard = getCloseablePositionsBigBoard(state.board.board[move.subRow][move.subCol].board, state.player);

        if(opponentNewWinningPositionsBigBoard.length < opponentOldWinningPositionsBigBoard.length){
            move.score += 3;
        }

        return move;

    }
}


module.exports = MCTS;
