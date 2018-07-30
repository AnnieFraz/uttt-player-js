
class WinningPossibilities{
    /*
    winningSequences = [["0,0","0,1","0,2"],
                        ["1,0","1,1","1,2"],
                        ["2,0","2,1","2,2"],
                        ["0,0","1,0","2,0"],
                        ["0,1","1,1","2,1"],
                        ["0,2","1,2","2,2"],
                        ["0,0","1,1","2,2"],
                        ["0,2","1,1","2,0"]];
    */
    

    

    /**
     *   0,0 | 0,1 | 0,2 to 0 | 1 | 2
     *   ---------------    ---------
     *   1,0 | 1,1 | 1,2    3 | 4 | 5
     *   ---------------    ---------
     *   2,0 | 2,1 | 2,2    6 | 7 | 8
     *   Move=RowCol,RowCol Move=Board,Cell
     * 
     *  y y y | - - - | - - -   For move x also evaluate board y 
     *  y y y | - - - | - - - 
     *  y y y | - - - | - - - 
     *  ------+-------+-------
     *  - - - | x - - | - - - 
     *  - - - | - - - | - - - 
     *  - - - | - - - | - - - 
     *  ------+-------+-------
     *  - - - | - - - | - - -
     *  - - - | - - - | - - -
     *  - - - | - - - | - - -
     *  ------+-------+-------
     *  
     *  - - 1 |       | 5 2 - Scored Board
     *  - 0 - |       | 2 - 2 
     *  1 - - |       | - 2 5 
     * -------+       +-------
     * 
     *  
     *  Ideas:
     *  Set importance for current board (i.e. is it about to be won, is it an important board)
     *  and set importance for next board (i.e. do i give up that board, how important is that board) 
     * 
     *  Criteria: WinningSequence, Cell/Board Weighting, 
     * 
     *  Weighting values:
     *  
     * 
     * 
     */



}