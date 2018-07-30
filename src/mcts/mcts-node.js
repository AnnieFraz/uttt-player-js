"use strict";

class MCTSNode{

    constructor(parent, move, state, unexpandedMoves){
        this.move = move;
        this.state = state;

        //MonteCarlo
        this.n_moves = 0;
        this.n_wins = 0;

        //Tree
        this.parent = parent;
        this.children = new Map();

        for(let move of unexpandedMoves) {
            this.children.set(move.hash(), {move: move, node: null})
        }

    }


    childNote(move){
        //TODO: Check this
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

    getUCB1(biasParam){
        return (this.n_wins / this.n_moves) + Math.sqrt(biasParam * Math.log(this.parent.n_moves) / this.n_moves);
    }

}

module.exports = MCTSNode;