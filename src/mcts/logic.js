"use strict";

const UTTT = require('@socialgorithm/ultimate-ttt').default;
const ME = require("@socialgorithm/ultimate-ttt/dist/model/constants").ME;
const OPPONENT = require("@socialgorithm/ultimate-ttt/dist/model/constants").OPPONENT;
const MCTS = require("./mcts");
const State = require("./state");
const Move = require('./move');

class GameLogic {
    constructor(player, size = 3){
        if(!player || player < ME || player > OPPONENT){
            throw new Error('Invalid player');
        }

        this.size = size;
        this.player = player;
        this.opponent = -player;

        this.init();
    }

    /* ----- Required methods ----- */

    init(){
        this.game = new UTTT(this.size);
        this.mcts = new MCTS(this.game);
        this.state = new State([], this.game, this.player);
    }

    addOpponentMove(board, move) {
        try {
            this.game = this.game.addOpponentMove(board, move);
        } catch (e) {
            console.error('-------------------------------');
            console.error("\n"+'AddOpponentMove: Game probably already over when adding', board, move, e);
            console.error("\n"+this.game.prettyPrint());
            console.error("\n"+this.game.stateBoard.prettyPrint(true));
            console.error('-------------------------------');
            throw new Error(e);
        }
    }

    addMove(board, move){
        try {
            this.game = this.game.addMyMove(board, move);
        } catch (e) {
            console.error('-------------------------------');
            console.error("\n"+'AddMyMove: Game probably already over when adding', board, move, e);
            console.error("\n"+this.game.prettyPrint());
            console.error("\n"+this.game.stateBoard.prettyPrint(true));
            console.error('-------------------------------');
            throw new Error(e);
        }
    }

    getMove(){
        console.log(this.state);
        this.mcts.runSearch(this.state);
        console.log(this.state);
        return this.mcts.bestMove(this.state);
    }
}

module.exports = GameLogic;
