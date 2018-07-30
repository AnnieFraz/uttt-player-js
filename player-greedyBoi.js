const readline = require('readline');
// Random player implementation
const GameLogic = require('./src/greedyBoi/logic');

/**
 * Random client implementation of the UTTT Game
 */

function input() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Load player's code
  let player = new GameLogic(1);

  rl.on('line', function (input) {
    const parts = input.split(' ');
    const action = parts[0];

    let next, move, coords;

    switch (action) {
      case 'init':
        player.init();
        break;
      case 'move':
        try {
          move = player.getMove();
          player.addMove(move.getBoardCoords(), move.getCoords());
          writeMove(move);
        } catch(e) {
          console.error('Player Error: Failed to get a move', e);
        }
        break;
      case 'opponent':
        //let time = Date.now();
        // the move will be in the format x,y;x,y
        // where the first pair are the board's coordinates
        // and the second one are the move's coordinates
        next = parts[1].split(';');
        const boardCoords = next[0].split(',').map((coord) => parseInt(coord, 10));
        const moveCoords = next[1].split(',').map((coord) => parseInt(coord, 10));
        player.addOpponentMove(
          [
            boardCoords[0],
            boardCoords[1]
          ],
          [
            moveCoords[0],
            moveCoords[1]
          ]
        );

        if (!player.game.isFinished()) {
            move = player.getMove();
            //console.log(move);
          player.addMove(move.getBoardCoords(), move.getCoords());
          writeMove(move);
        }

        //let time2 = Date.now() - time;
        //console.log("Move end: " + time2);
        break;
    }
    /*
    if(player.game.isFinished()){
      player.save();
    }*/
  });
}

function writeMove(move) {
  write(move.hash());
}

function player() {
  input();
}

function write(output) {
  if (output) {
    console.log(output);
  }
}

player();