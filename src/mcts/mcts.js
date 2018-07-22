"use strict";

const MCTSNode = require('./mcts-node');
const Move = require('./move');
const State = require('./state');

class MCTS{

    constructor(game, UCB1ExploreParam = 2){
        this.game = game;
        this.UCB1ExploreParam = UCB1ExploreParam;
        this.nodes = new Map() // map: State.hash()
    }

    makeNode(state){
        if(!this.nodes.has(state.hash())){
            let unexpandedMoves = state.legalMoves().slice();
            let node = new MCTSNode(null, null, state, unexpandedMoves);
            this.nodes.set(state.hash(), node)
        }
    }

    runSearch(state, timeout = 3){
        //Todo
        this.makeNode(state);

        let draws = 0;
        let totalSims = 0;

        let end = Date.now() + timeout * 1000;

        while(Date.now() < end) {

            let node = this.select(state);
            let winner = state.board.winner;
            //Check this
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
        //Todo
        this.makeNode(state);

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
        //Todo
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

        let childState = node.state.nextState(move); //TODO: Make this work (Utility functions)
        let childUnexpandedMoves = childState.legalMoves(); //TODO: Make this work (Utility functions)

        let childNode = node.expand(move, childState, childUnexpandedMoves);

        this.nodes.set(childState.hash(), childNode);

        return childNode;
    }


    //Phase 3
    simulate(node){
        //Todo
        let state = node.state;
        let winner = state.board.winner;

        while(winner === undefined){
            let moves = state.legalMoves(); //TODO: Utility function
            let move = moves[Math.floor(Math.random() * moves.length)];
            state = state.nextState(move); //TODO: Utility function
            winner = state.board.winner; //TODO: Utility function
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
}


module.exports = MCTS;
