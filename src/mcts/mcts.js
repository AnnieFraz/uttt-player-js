const MCTSNode = require('./mcts-node');
const Move = require('./move')

class MCTS{

    constructor(game, UCB1ExploreParam = 2){
        this.game = game;
        this.UCB1ExploreParam = UCB1ExploreParam;
        this.nodes = new Map() // map: State.hash()
    }

    makeNode(state){
        console.log(state);
        if(!this.nodes.has(state.hash())){
            let unexpandedPlays = this.legalMoves(state).slice(); //TODO: Make this
            let node = new MCTSNode(null, null, state, unexpandedPlays);
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

            if (node.isLeaf() === false && winner === null) {
                node = this.expand(node);
                winner = this.simulate(node);
            }

            this.backpropogate(node, winner);

            if (winner === 0)
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

        let node = this.nodes.get(state.hash);
        let allMoves = node.allMoves();
        let bestMove;

        let max = -Infinity;
        for(let move of allMoves) {
            let childNode = node.childNote(move);
            let ratio = childNode.n_wins / childNode.n_plays;
            if(ratio > max){
                bestMove = play;
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
        //Todo
        let moves = node.unexpandedMoves();
        let index = Math.floor(Math.random() * moves.length);
        let move = moves[index];

        let childState = this.nextState(node.state, move); //TODO: Make this work (Utility functions)
        let childUnexpandedPlays = this.legalMoves(childState); //TODO: Make this work (Utility functions)
        let childNode = node.expand(move, childState, childUnexpandedPlays);
        this.nodes.set(childState.hash(), childNode);

        return childNode;
    }


    //Phase 3
    simulate(node){
        //Todo
        let state = node.state;
        let winner = this.game.winner(state);

        while(winner === null){
            let moves = this.legalPlays(state); //TODO: Utility function
            let move = moves[Math.floor(Math.random() * moves.length)];
            state = this.nextState(state, move); //TODO: Utility function
            winner = this.winner(state); //TODO: Utility function
        }
    }


    //Phase 4
    backpropogate(node, winner){

        while(node != null){
            node.n_plays += 1;

            if(node.state.isPlayer(-winner)){
                node.n_wins += 1;
            }

            node = node.parent;
        }
    }


    /** Utility functions to fill gaps in engine api **/
    nextState(state, move){
        return state.board.addMyMove(move.getBoardCoords(),move.getCoords())
    }

    legalMoves(state){
        let validBoards = state.board.getValidBoards();
        let moves = [];
        for(let subCoords of validBoards){
            let subBoard = state.board.board[subCoords[0]][subCoords[1]];
            let validMoves = subBoard.getValidMoves();
            for(let valMove of validMoves){
                let move = new Move(subCoords[0], subCoords[1], valMove[0], valMove[1]);
                moves.push(move)
            }
        }

        return moves;
    }

}


module.exports = MCTS;