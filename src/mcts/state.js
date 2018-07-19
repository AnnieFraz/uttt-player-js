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
}

module.exports = State;