"use strict";

class Move {

    constructor(row, col, subRow, subCol, score){
        this.row = row;
        this.col = col;
        this.subRow = subRow;
        this.subCol = subCol;
        this.score = score;
    }

    hash(){
        return this.row.toString() + "," + this.col.toString() + ";" + this.subRow.toString() + "," + this.subCol.toString();
    }

    getBoardCoords(){
        return [this.row, this.col];
    }

    getCoords(){
        return [this.subRow, this.subCol];
    }
}

module.exports = Move;