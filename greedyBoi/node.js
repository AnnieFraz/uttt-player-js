/**
 * TODO: Chane this to fit new requirements
 */

class Node{

    constructor(parent, move, state, unexpandedMoves){
        this.move = move;
        this.state = state;
        this.score = this.evalMove(state, move);

        //Tree
        this.parent = parent;
        this.children = new Map();

        for(let move of unexpandedMoves) {
            this.children.set(move.hash(), {move: move, node: null})
        }

    }


    childNode(move){
        let child = this.children.get(move.hash());
        if(child === undefined){
            throw new Error("No such move!");
        }else if(child.node === null){
            throw new Error("Child is not expanded!");
        }

        return child.node;
    }

    expand(move, childState, unexpandedMoves){
        //TODO: Check this
        if (!this.children.has(move.hash()))
            throw new Error("No such move!");

        let childNode = new MCTSNode(this, move, childState, unexpandedMoves);
        this.children.set(move.hash(), {move: move, node: childNode})

        return childNode;
    }

    allMoves(){
        //TODO: Check this

        let ret = [];
        for(let child of this.children.values()){
            ret.push(child.move);
        }

        return ret;
    }

    unexpandedMoves(){
        //TODO: Check this
        let ret = [];
        for(let child of this.children.values()){
            if(child.node === null)
                ret.push(child.move);
        }

        return ret;
    }

    isFullyExpanded(){
        //TODO: Check this

        for(let child of this.children.values()){
            if(child.node === null)
                return false;
        }

        return true;
    }

    isLeaf(){

        if(this.children.size === 0)
            return true;

        return false;
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
            move.score += 3;
        }

        return move;

    }

}

module.exports = Node;